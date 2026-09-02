document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchInput');
    const typeSelect = document.getElementById('typeSelect');
    const sortSelect = document.getElementById('sortSelect');

    // 圈速转秒数工具函数
    function parseLapTime(timeStr) {
        if (!timeStr || typeof timeStr !== 'string') return 9999;
        // 纯秒数格式（如 "57.924"）
        if (!timeStr.includes(':')) {
            const sec = parseFloat(timeStr);
            return isNaN(sec) ? 9999 : sec;
        }
        // 分:秒格式（如 "1:00.778"）
        const parts = timeStr.split(':');
        const min = parseFloat(parts[0]);
        const sec = parseFloat(parts[1]);
        if (isNaN(min) || isNaN(sec)) return 9999;
        return min * 60 + sec;
    }

    // 统一更新列表
    function updateList() {
        // 数据还没加载完就先不执行
        if (!allVehicles || allVehicles.length === 0) return;
        
        let result = [...allVehicles];

        // 关键词搜索
        const keyword = searchInput.value.trim().toLowerCase();
        if (keyword) {
            result = result.filter(item =>
                (item.name || '').toLowerCase().includes(keyword) ||
                (item.typeName || '').toLowerCase().includes(keyword) ||
                (item.dlc || '').toLowerCase().includes(keyword)
            );
        }

        // 类型筛选
        const type = typeSelect.value;
        if (type) {
            result = result.filter(item => item.type === type);
        }

        // 排序逻辑
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
                // 圈速从快到慢（时间越短越靠前）
                result.sort((a, b) => parseLapTime(a.lapTime) - parseLapTime(b.lapTime));
                break;
            case 'laptime-desc':
                // 圈速从慢到快
                result.sort((a, b) => parseLapTime(b.lapTime) - parseLapTime(a.lapTime));
                break;
        }

        renderList(result);
    }

    // 绑定所有触发事件
    searchInput.addEventListener('input', updateList);
    typeSelect.addEventListener('change', updateList);
    sortSelect.addEventListener('change', updateList);

    // 数据加载完成后自动重新渲染一次
    window.addEventListener('load', updateList);
});
