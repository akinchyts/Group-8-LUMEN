window.DecisionData=(()=>{
  const evaluateStrategy=async strategy=>{
    if(typeof window.LumenDecisionEngine?.evaluate!=='function') return null;
    return window.LumenDecisionEngine.evaluate(strategy);
  };

  const getDecision=async()=>evaluateStrategy(
    window.LumenStrategy?.getState?.()||null
  );

  const getWeatherContext=async month=>{
    if(typeof window.DiscoverData?.timingEngine!=='function') return null;
    const timing=await window.DiscoverData.timingEngine();
    const numericMonth=typeof month==='number'
      ?month
      :new Date(`${month} 1, 2026`).getMonth()+1;

    return {
      ...timing.getMonthContext(numericMonth),
      source:'Historical weather and seasonality data'
    };
  };

  return {getDecision,evaluateStrategy,getWeatherContext};
})();
