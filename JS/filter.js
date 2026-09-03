const typeSelect = document.getElementById('typeSelect');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');

function renderFilter(){
  let list = [...allVehicles];
  // 类型过滤
  const selType = typeSelect.value;
  if(selType !== ""){
    list = list.filter(car => car.type === selType);
  }
  //搜索过滤
  const kw = searchInput.value.trim().toLowerCase();
  if(kw){
    list = list.filter(car=> car.name.toLowerCase().includes(kw))
  }
  //排序逻辑省略...
  renderVehicleList(list);
}

//绑定事件
typeSelect.onchange = renderFilter;
searchInput.oninput = renderFilter;
sortSelect.onchange = renderFilter;
