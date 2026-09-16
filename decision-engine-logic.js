window.LumenDecisionEngine=(()=>{
  const number=value=>Number(value)||0;
  const average=values=>values.length
    ?values.reduce((sum,value)=>sum+value,0)/values.length
    :0;
  const clamp=value=>Math.max(0,Math.min(100,Math.round(value)));

  const monthNumber=month=>new Date(`${month} 1, 2026`).getMonth()+1;

  const validate=strategy=>{
    const missing=[];
    if(!strategy?.price) missing.push('candidate price');
    if(!strategy?.city) missing.push('city / region');
    if(!strategy?.channels?.length) missing.push('at least one channel');
    if(!strategy?.launchMonth) missing.push('launch month');
    if(!strategy?.targetSegment) missing.push('target segment');
    if(!strategy?.objective) missing.push('strategic objective');
    if(number(strategy?.marketingBudget)<0) {
      missing.push('a non-negative marketing budget');
    }
    return missing;
  };

  const evaluate=async strategy=>{
    const missing=validate(strategy);

    if(missing.length) {
      return {
        status:'incomplete',
        missing,
        strategy,
        reason:'Complete the Strategy Builder before requesting an evaluation.'
      };
    }

    const [pricing,cities,timing,marketing,customers]=await Promise.all([
      DiscoverData.pricingLab(),
      DiscoverData.cityPrioritizer(),
      DiscoverData.timingEngine(),
      DiscoverData.marketingPlanner(),
      DiscoverData.customerSummary()
    ]);

    const priceOption=pricing.options.find(
      option=>option.price===number(strategy.price)
    );
    const city=cities.cities.find(item=>item.name===strategy.city);
    const segment=customers.segments.find(
      item=>item.name===strategy.targetSegment
    );
    const timingContext=timing.getMonthContext(
      monthNumber(strategy.launchMonth)
    );

    const selectedRows=priceOption?.channels.filter(
      row=>strategy.channels.includes(row.channel)
    )||[];

    if(!priceOption||!city||!segment||!selectedRows.length) {
      return {
        status:'unavailable',
        strategy,
        reason:'The selected strategy cannot be matched to available analytics outputs.'
      };
    }

    const channelWeights=Object.fromEntries(
      selectedRows.map(row=>[row.channel,1/selectedRows.length])
    );

    const unitNetRevenue=average(
      selectedRows.map(row=>number(row.net_price_to_lumen_eur))
    );
    const unitContribution=average(
      selectedRows.map(row=>number(row.unit_contribution_eur))
    );
    const contributionMarginPct=average(
      selectedRows.map(row=>number(row.contribution_margin_pct))
    );

    const cac=average(marketing.channels.map(row=>number(row.cac)));
    const ltv=average(marketing.channels.map(row=>number(row.ltv)));
    const ltvCac=cac?ltv/cac:null;

    const seasonality=number(timingContext.seasonality?.index);
    const promotions=number(timingContext.promotions);

    const demandScore=clamp(
      priceOption.acceptance*.6+segment.intent*4
    );
    const economicsScore=clamp(
      contributionMarginPct*.7+(ltvCac||0)*10
    );
    const cityScore=clamp(
      city.marketShare*100*.6+city.cagr*100*.2+(city.intent||0)*4
    );
    const timingScore=clamp(seasonality*.75-promotions*4);

    const objectiveFit={
      'Build awareness':demandScore,
      'Validate demand':average([demandScore,cityScore]),
      'Drive contribution':economicsScore
    }[strategy.objective]||average([demandScore,economicsScore]);

    const strategyScore={
      total:clamp(
        demandScore*.25+
        economicsScore*.35+
        cityScore*.20+
        timingScore*.10+
        objectiveFit*.10
      ),
      components:{
        demand:demandScore,
        economics:economicsScore,
        city:cityScore,
        timing:timingScore,
        objectiveFit
      }
    };

    const positioning=number(strategy.price)>=2.59
      ?'Premium functional performance'
      :number(strategy.price)>=2.19
        ?'Accessible premium functional refreshment'
        :'Accessible trial-led functional refreshment';

    const tradeOff=number(strategy.price)>=2.59
      ?'This choice prioritises unit economics and premium positioning over broad initial acceptance.'
      :number(strategy.price)<=1.79
        ?'This choice prioritises trial and acceptance over contribution per unit and premium price signalling.'
        :'This choice balances price acceptance with contribution, rather than maximising either one.';

    const risks=[];
    if(priceOption.acceptance<35) {
      risks.push('Price-test acceptance is comparatively low at the selected price.');
    }
    if((ltvCac||0)<3) {
      risks.push('The plan is below the 3:1 LTV:CAC reference threshold.');
    }
    if(promotions>0) {
      risks.push('Competitor promotion activity overlaps the selected launch month.');
    }
    if(seasonality<100) {
      risks.push('Selected timing is below the average seasonality index.');
    }
    risks.push(
      'Germany has no historical LUMEN sales; estimates rely on aggregate survey data and comparable markets.'
    );

    const projectedCustomers=cac
      ?Math.floor(number(strategy.marketingBudget)/cac)
      :0;

    return {
      status:'ready',
      strategy:{...strategy,channelWeights},
      recommendation:{
        price:number(strategy.price),
        channelMix:channelWeights,
        city:strategy.city,
        timing:strategy.launchMonth,
        targetSegment:strategy.targetSegment,
        positioning
      },
      economics:{
        unitNetRevenue,
        unitContribution,
        contributionMarginPct,
        cac,
        ltv,
        ltvCac,
        marketingBudget:number(strategy.marketingBudget),
        projectedCustomers,
        projectedLifetimeRevenue:projectedCustomers*ltv,
        payback:'Not estimated: supplied data has no payback-period series.'
      },
      strategyScore,
      rationale:[
        `€${number(strategy.price).toFixed(2)} has ${priceOption.acceptance.toFixed(1)}% estimated acceptance in the price test.`,
        `${strategy.channels.join(' + ')} yields an equal-weight unit contribution of €${unitContribution.toFixed(2)}.`,
        `${strategy.city} combines ${(city.marketShare*100).toFixed(1)}% reported market share with ${city.cagr.toFixed(1)}% growth.`,
        `${strategy.launchMonth} has a seasonality index of ${seasonality.toFixed(0)}.`
      ],
      risks,
      tradeOffs:[tradeOff],
      nonOptimisedOutcomes:[tradeOff],
      evidence:{
        priceTest:{
          acceptance:priceOption.acceptance,
          contributionMarginPct
        },
        city:{
          marketShare:city.marketShare,
          cagr:city.cagr,
          intent:city.intent
        },
        timing:{
          seasonalityIndex:seasonality,
          promotionCount:promotions
        },
        marketing:{ltvCac}
      },
      assumptions:[
        'Selected channels are equally weighted because Strategy Builder does not collect percentages.',
        'Projected lifetime revenue is a marketing proxy, not a German sales forecast.',
        'Historical weather and seasonality data are used; no live-weather API is required.',
        'No raw respondent-level data is used or returned.'
      ]
    };
  };

  return {evaluate};
})();