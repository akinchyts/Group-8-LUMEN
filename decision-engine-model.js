(()=>{
  const round=(n,d=2)=>Number(Number(n||0).toFixed(d));
  const clamp=(n,min=0,max=100)=>Math.max(min,Math.min(max,n));
  const evaluate=async(state={})=>{
    const [pricing,channels,cities,timing,marketing]=await Promise.all([
      DiscoverData.pricingLab(),DiscoverData.channelOptimizer(),DiscoverData.cityPrioritizer(),DiscoverData.timingEngine(),DiscoverData.marketingPlanner()
    ]);
    const price=Number(state.price)||2.19;
    const priceRow=pricing.options.find(x=>Number(x.price)===price)||pricing.options.find(x=>Number(x.price)===2.19)||pricing.options[0];
    const weights=Array.isArray(state.channels)?Object.fromEntries(state.channels.map(x=>[x,1])):(state.channels&&Object.keys(state.channels).length?state.channels:{'DTC Online':40,'Retail / Grocery':60});
    const mix=channels.calculateMix(weights)||channels.calculateMix(Object.fromEntries(channels.rows.map(x=>[x.name,100/channels.rows.length])));
    const cityScores=cities.cities.map(x=>({...x,score:round(clamp(Number(x.marketShare||0)*3+Number(x.cagr||0)*2+Number(x.intent||0)*4))})).sort((a,b)=>b.score-a.score);
    const city=state.city&&state.city!=='All cities'?cityScores.find(x=>x.name===state.city)||cityScores[0]:cityScores[0];
    const monthNames=['January','February','March','April','May','June','July','August','September','October','November','December'];
    const bestMonths=[...timing.months].sort((a,b)=>Number(b.index||0)-Number(a.index||0));
    const launchMonth=state.launchMonth&&state.launchMonth!=='Not set'?state.launchMonth:'May';
    const month=timing.getMonthContext(monthNames.indexOf(launchMonth)+1)?.seasonality||bestMonths[0]||{};
    const marketingRows=marketing.channels;
    const marketingWeights={'Influencer / Content':40,'Referral / Subscription':35,'Retail Sampling':25};
    const budget=Number(state.marketingBudget)||50000;
    const totalWeight=Object.values(marketingWeights).reduce((a,b)=>a+b,0);
    const selectedMarketing=marketingRows.filter(x=>marketingWeights[x.name]).map(x=>({...x,amount:budget*marketingWeights[x.name]/totalWeight,customers:budget*marketingWeights[x.name]/totalWeight/Number(x.cac||1)}));
    const blendedCAC=selectedMarketing.reduce((s,x)=>s+x.amount,0)/Math.max(1,selectedMarketing.reduce((s,x)=>s+x.customers,0));
    const blendedLTV=selectedMarketing.reduce((s,x)=>s+x.customers*x.ltv,0)/Math.max(1,selectedMarketing.reduce((s,x)=>s+x.customers,0));
    const customers=selectedMarketing.reduce((s,x)=>s+x.customers,0);
    const netRevenue=customers*Number(mix.netRevenue||0), contribution=customers*Number(mix.contribution||0);
    const acceptance=Number(priceRow?.acceptance||0);
    const priceScore=clamp(acceptance*0.75+Number(priceRow?.margin||0)*25);
    const channelScore=clamp(Number(mix.contribution||0)/1.2*100);
    const timingScore=clamp(Number(month.index||100)/1.38);
    const marketingScore=clamp((blendedLTV/Math.max(1,blendedCAC))/3*100);
    const score=round(priceScore*.25+channelScore*.25+city.score*.2+timingScore*.15+marketingScore*.15,0);
    return {summary:{price,city:city.name,timing:launchMonth,primaryChannel:'Retail / Grocery + DTC Online',positioning:'Accessible premium performance',score},economics:{estimatedCustomers:round(customers,0),netRevenue:round(netRevenue),contribution:round(contribution),contributionMargin:round(Number(mix.contribution||0)/Math.max(.01,Number(mix.netRevenue||0))*100,1),blendedCAC:round(blendedCAC),blendedLTV:round(blendedLTV),ltvCac:round(blendedLTV/Math.max(1,blendedCAC),1),paybackPurchases:round(blendedCAC/Math.max(.01,Number(mix.contribution||0)),1)},rationale:[`€${price.toFixed(2)} balances ${acceptance.toFixed(1)}% observed acceptance with positive unit contribution.`,`The channel mix combines customer preference with stronger unit economics.`,`${city.name} leads the evidence score from reported market share, growth, survey intent, and respondent coverage.`,`${launchMonth} creates pre-peak lead time; supplied seasonality peaks in ${monthNames[Number(bestMonths[0]?.month)-1]||'summer'}.`],risks:['German launch evidence is based on supplied market, survey, competitor, and proxy data rather than German sales history.','City and timing scores are directional; they should be validated with local distribution capacity and current weather.','Marketing economics use observed CAC/LTV benchmarks and do not guarantee future conversion.'],tradeoff:`This strategy deliberately prioritises balanced contribution and learnable channel economics over maximum volume at €1.79, maximum unit margin at €2.59, or immediate national coverage.`,assumptions:[`Marketing budget: €${budget.toLocaleString('de-DE')}.`,`Estimated customers use observed CAC benchmarks; revenue and contribution are first-order unit estimates.`,`No customer names or email addresses are loaded or exposed.`],breakdown:[['Price',round(priceScore,0),`${acceptance.toFixed(1)}% observed acceptance`],['Channels',round(channelScore,0),`€${Number(mix.contribution||0).toFixed(2)} contribution / unit`],['City',round(city.score,0),`${city.name} evidence score`],['Timing',round(timingScore,0),`${month.index||'—'} seasonality index`],['Marketing',round(marketingScore,0),`${round(blendedLTV/Math.max(1,blendedCAC),1)}x observed LTV:CAC`]]};
  };
  window.LumenDecisionEngine={evaluate};
})();
