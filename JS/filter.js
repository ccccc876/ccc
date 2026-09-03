// 获取DOM元素
const typeSelect = document.getElementById('typeSelect');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');

// 辅助：把 "分:秒.毫秒" 转成总秒数，用于排序
function timeToSeconds(timeStr) {
    if (!timeStr || timeStr === "无") return Infinity;
    const parts = timeStr.split(':');
    if (parts.length === 2) {
        return parseFloat(parts[0]) * 60 + parseFloat(parts[1]);
    }
    return parseFloat(timeStr);
}

// 统一筛选排序渲染
function renderFilter() {
    let resultList = [...allVehicles];

    // 1. 类型筛选（对应字段 type）
    const typeVal = typeSelect.value;
    if (typeVal) {
        resultList = resultList.filter(item => item.type === typeVal);
    }


    // 2. 名称搜索
    const keyword = searchInput.value.trim().toLowerCase();
    if (keyword) {
        resultList = resultList.filter(item => item.name.toLowerCase().includes(keyword));
    }

    // 3. 排序（字段全部和 main.js 对齐）
    const sortVal = sortSelect.value;
    switch (sortVal) {
        case 'price-desc':
            resultList.sort((a, b) => b.price - a.price);
            break;
        case 'price-asc':
            resultList.sort((a, b) => a.price - b.price);
            break;
        case 'topspeed-desc':
            resultList.sort((a, b) => b.topSpeed - a.topSpeed);
            break;
        case 'topspeed-asc':
            resultList.sort((a, b) => a.topSpeed - b.topSpeed);
            break;
        case 'ccgp-asc':
            resultList.sort((a, b) => timeToSeconds(a.lapTime) - timeToSeconds(b.lapTime));
            break;
        case 'ccgp-desc':
            resultList.sort((a, b) => timeToSeconds(b.lapTime) - timeToSeconds(a.lapTime));
            break;
        case 'mountain-asc':
            resultList.sort((a, b) => timeToSeconds(a.mountainLapTime) - timeToSeconds(b.mountainLapTime));
            break;
        case 'mountain-desc':
            resultList.sort((a, b) => timeToSeconds(b.mountainLapTime) - timeToSeconds(a.mountainLapTime));
            break;
        default:
            break;
    }

    // 调用 main.js 里真实存在的渲染函数
    renderList(resultList);
}

// 绑定事件
typeSelect.addEventListener('change', renderFilter);
searchInput.addEventListener('input', renderFilter);
sortSelect.addEventListener('change', renderFilter);
