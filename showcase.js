(()=>{
  const content=document.querySelector('#content');
  const routeName=document.querySelector('#route-name');
  const showcase=()=>{
    if(location.hash.slice(1)!=='/internal/showcase')return;
    routeName.textContent='Component Showcase';
    const navigation=document.querySelector('#navigation');
    navigation.querySelectorAll('.nav-link').forEach(link=>link.classList.remove('active'));
    navigation.insertAdjacentHTML('beforeend','<section class="nav-section"><p class="nav-label">Reference</p><a class="nav-link active" href="#/internal/showcase">Component Showcase</a></section>');
    content.innerHTML=UI.pageHeader({eyebrow:'Internal reference',title:'Component Showcase',description:'Generic sample content for checking the shared LaunchOS interface. No business conclusion is shown.'})+
      UI.section({title:'Layout and data display',description:'Reusable structural and reporting components.',body:UI.contentGrid({body:UI.metricCard({label:'Example metric',value:'128',context:'Generic demo value'})+UI.insightCard({title:'Example insight',body:'A concise, neutral observation for presentation testing.'})+UI.recommendationCard({title:'Example card',body:'A generic communication card without a recommendation.'})})})+
      UI.section({title:'Badges and tables',body:UI.twoColumn({primary:UI.comparisonTable({headers:['Option','Status','Score'],rows:[['Option A',UI.statusBadge({label:'Available',tone:'positive'}),UI.scoreBadge({label:'82',tone:'neutral'})],['Option B',UI.statusBadge({label:'Review',tone:'warning'}),UI.scoreBadge({label:'64',tone:'neutral'})]]}),secondary:UI.ranking({items:['First ranked item','Second ranked item','Third ranked item']})})})+
      UI.section({title:'Controls',description:'Controls emit a ui:change event and the slider output updates as its value changes.',body:UI.filterControls({body:UI.select({id:'showcase-select',label:'Select view',options:['Summary','Detail']})+UI.multiSelect({id:'showcase-multi',label:'Compare items',options:['Alpha','Beta','Gamma']})+UI.slider({id:'showcase-slider',label:'Example range',min:0,max:10,value:5,suffix:' units'})+UI.toggle({id:'showcase-toggle',label:'Include comparison'})+UI.monthSelect({id:'showcase-month'})+UI.button({label:'Primary action',tone:'primary'})+UI.button({label:'Secondary action'})})})+
      UI.section({title:'Tabs',body:UI.tabs({id:'showcase-tabs',items:[{label:'Overview',content:'<p>First accessible tab panel.</p>'},{label:'Details',content:'<p>Second accessible tab panel.</p>'},{label:'Notes',content:'<p>Third accessible tab panel.</p>'}]})})+
      UI.section({title:'SVG chart components',description:'Generic visual primitives supplied with demonstration data.',body:UI.contentGrid({body:UI.lineChart({title:'Line chart',labels:['Jan','Feb','Mar','Apr'],series:[{label:'Series A',values:[2,5,3,7]},{label:'Series B',values:[3,2,6,5]}]})+UI.barChart({title:'Bar chart',labels:['A','B','C','D'],values:[4,7,3,6]})+UI.donutChart({title:'Donut chart',segments:[{label:'Group A',value:45},{label:'Group B',value:30},{label:'Group C',value:25}]})+UI.scatterChart({title:'Positioning chart',points:[{label:'A',x:2,y:4},{label:'B',x:5,y:3},{label:'C',x:7,y:7}]})})})+
      UI.section({title:'Communication and states',body:UI.contentGrid({body:UI.businessImplication({body:'Use this component to explain evidence without prescribing a decision.'})+UI.tradeoffCard({title:'Example trade-off',body:'A concise comparison of two valid considerations.'})+UI.riskCard({title:'Example risk',body:'A neutral statement of a condition to monitor.'})+UI.recommendationBanner({title:'Example banner',body:'Reserved for a decision supplied by the appropriate engine.'})+UI.state({type:'mock'})+UI.state({type:'loading'})+UI.state({type:'unavailable'})})});
    UI.activate(content);
  };
  window.addEventListener('hashchange',showcase);
  showcase();
})();
