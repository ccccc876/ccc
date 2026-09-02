// 筛选与排序控制器
const searchInput = document.getElementById('searchInput');
const typeSelect = document.getElementById('typeSelect');
const sortSelect = document.getElementById('sortSelect');

// 圈速转秒数工具函数 - 兼容「55.123」纯秒 和「1:00.411」分:秒 两种格式
function parseLapTime(timeStr) {
    if (!timeStr || typeof timeStr !== 'string') return Infinity;
    
    // 纯秒数格式（无冒号）
    if (!timeStr.includes(':')) {
        const sec = parseFloat(timeStr);
        return isNaN(sec) ? Infinity : sec;
    }
    
    // 分:秒格式
    const parts = timeStr.split(':');
    const min = parseFloat(parts[0]);
    const sec = parseFloat(parts[1]);
    if (isNaN(min) || isNaN(sec)) return Infinity;
    return min * 60 + sec;
}

// 统一更新列表：搜索 + 筛选 + 排序 组合生效
function updateList() {
    let result = [...allVehicles];

    // 1. 关键词搜索（名称/类型/DLC）
    const keyword = searchInput.value.trim().toLowerCase();
    if (keyword) {
        result = result.filter(item =>
            (item.name || '').toLowerCase().includes(keyword) ||
            (item.typeName || '').toLowerCase().includes(keyword) ||
            (item.dlc || '').toLowerCase().includes(keyword)
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
        case 'ccgp-asc':
            // CCGP圈速 从快到慢（时间越短越靠前）
            result.sort((a, b) => parseLapTime(a.ccgpTime) - parseLapTime(b.ccgpTime));
            break;
        case 'ccgp-desc':
            // CCGP圈速 从慢到快
            result.sort((a, b) => parseLapTime(b.ccgpTime) - parseLapTime(a.ccgpTime));
            break;
        default:
            break;
    }

    renderList(result);
}

// 绑定所有触发事件
searchInput.addEventListener('input', updateList);
typeSelect.addEventListener('change', updateList);
sortSelect.addEventListener('change', updateList);

