// 筛选与排序控制器
const searchInput = document.getElementById('searchInput');
const typeSelect = document.getElementById('typeSelect');
const sortSelect = document.getElementById('sortSelect');

// 统一更新列表：搜索 + 筛选 + 排序 组合生效
function updateList() {
    let result = [...allVehicles];

    // 1. 关键词搜索（名称/类型/DLC）
    const keyword = searchInput.value.trim().toLowerCase();
    if (keyword) {
        result = result.filter(item =>
            item.name.toLowerCase().includes(keyword) ||
            item.typeName.toLowerCase().includes(keyword) ||
            item.dlc.toLowerCase().includes(keyword)
        );
    }

    // 2. 载具类型筛选
    const type = typeSelect.value;
    if (type) {
        result = result.filter(item => item.type === type);
    }

    // 3. 排序逻辑
    const sortRule = sortSelect.value;
    switch (sortRule) {
        case 'price-desc':
            result.sort((a, b) => b.price - a.price);
            break;
        case 'price-asc':
            result.sort((a, b) => a.price - b.price);
            break;
        case 'topspeed-desc':
            result.sort((a, b) => b.topSpeed - a.topSpeed);
            break;
        case 'topspeed-asc':
            result.sort((a, b) => a.topSpeed - b.topSpeed);
            break;
        case 'laptime-asc':
            // 圈速越快（秒数越小）排越前；无圈速数据的自动排最后
            result.sort((a, b) => (a.lapTime || 999) - (b.lapTime || 999));
            break;
        case 'laptime-desc':
            result.sort((a, b) => (b.lapTime || 0) - (a.lapTime || 0));
            break;
    }

    renderList(result);
}

// 绑定所有触发事件
searchInput.addEventListener('input', updateList);
typeSelect.addEventListener('change', updateList);
sortSelect.addEventListener('change', updateList);
