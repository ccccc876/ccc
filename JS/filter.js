// 筛选与排序控制器
const searchInput = document.getElementById('searchInput');
const typeSelect = document.getElementById('typeSelect');
const sortSelect = document.getElementById('sortSelect');

// ===== CCGP 圈速解析（优化版） =====
// 兼容格式：数字54.704、字符串"54.704"、"0:54.704"、"1:01.428"
function parseLapTime(timeStr) {
    // 兼容数字类型输入
    if (typeof timeStr === 'number') {
        return isNaN(timeStr) ? Infinity : timeStr;
    }
    if (!timeStr || typeof timeStr !== 'string') return Infinity;
    
    timeStr = timeStr.trim();
    if (timeStr === '' || timeStr === '无') return Infinity;

    // 包含冒号：按 分:秒.毫秒 解析
    if (timeStr.includes(':')) {
        const parts = timeStr.split(':').slice(0, 2);
        const min = parseFloat(parts[0]);
        const sec = parseFloat(parts[1]);
        if (isNaN(min) || isNaN(sec)) return Infinity;
        return min * 60 + sec;
    }

    // 不包含冒号：按纯秒数解析
    const sec = parseFloat(timeStr);
    return isNaN(sec) ? Infinity : sec;
}

// ===== 山道之王圈速解析（优化版） =====
// 兼容格式："5.18.306"、"5.29(Hb-er)"、纯数字秒数
function parseMountainTime(timeStr) {
    if (typeof timeStr === 'number') {
        return isNaN(timeStr) ? Infinity : timeStr;
    }
    if (!timeStr || typeof timeStr !== 'string') return Infinity;
    
    timeStr = timeStr.trim();
    if (timeStr === '' || timeStr === '无') return Infinity;

    // 去掉括号及玩家名
    const cleanStr = timeStr.replace(/\(.*\)/, '').trim();
    // 按点分割：分.秒.毫秒
    const parts = cleanStr.split('.');
    
    if (parts.length >= 2) {
        const min = parseFloat(parts[0]);
        const sec = parseFloat(parts[1]);
        const ms = parts[2] ? parseFloat(parts[2]) / 1000 : 0;
        if (isNaN(min) || isNaN(sec)) return Infinity;
        return min * 60 + sec + ms;
    }

    // 兼容纯秒数格式
    const sec = parseFloat(cleanStr);
    return isNaN(sec) ? Infinity : sec;
}

// 统一更新列表：搜索 + 筛选 + 排序 组合生效
function updateList() {
    let result = [...allVehicles];

    // 1. 关键词搜索
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
            result.sort((a, b) => {
                const ta = parseLapTime(a.lapTime);
                const tb = parseLapTime(b.lapTime);
                if (ta !== tb) return ta - tb;
                return a.name.localeCompare(b.name);
            });
            break;
        case 'ccgp-desc':
            result.sort((a, b) => {
                const ta = parseLapTime(a.lapTime);
                const tb = parseLapTime(b.lapTime);
                if (ta !== tb) return tb - ta;
                return a.name.localeCompare(b.name);
            });
            break;
        // 山道之王排序
        case 'mountain-asc':
            result.sort((a, b) => {
                const ta = parseMountainTime(a.mountainLapTime);
                const tb = parseMountainTime(b.mountainLapTime);
                if (ta !== tb) return ta - tb;
                return a.name.localeCompare(b.name);
            });
            break;
        case 'mountain-desc':
            result.sort((a, b) => {
                const ta = parseMountainTime(a.mountainLapTime);
                const tb = parseMountainTime(b.mountainLapTime);
                if (ta !== tb) return tb - ta;
                return a.name.localeCompare(b.name);
            });
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
