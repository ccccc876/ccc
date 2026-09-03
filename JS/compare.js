const compareModal = document.getElementById('compareModal');
const compareContent = document.getElementById('compareContent');
const closeCompareBtn = document.getElementById('closeCompareBtn');
const openCompareBtn = document.getElementById('openCompareBtn');

// 解析圈速：去掉括号备注，统一成秒数
function parseLapTime(str) {
    if (!str || str.trim() === '') return 99999;

    let s = String(str)
        .replace(/\(.*?\)/g, '')   // 去掉 (Hb‑er) 这类备注
        .replace(/[^0-9:.]/g, '') // 只保留数字、冒号、小数点
        .trim();

    if (s.includes(':')) {
        const parts = s.split(':');
        const min = parseFloat(parts[0]) || 0;
        const sec = parseFloat(parts[1]) || 0;
        return min * 60 + sec;
    }

    return parseFloat(s) || 99999;
}

// 找出数组里最小值的索引
function findFastestIndex(arr) {
    let minVal = Infinity;
    let minIndex = -1;

    arr.forEach((val, index) => {
        if (val < minVal) {
            minVal = val;
            minIndex = index;
        }
    });

    return minIndex;
}

function openComparePanel() {
    if (!allVehicles || allVehicles.length === 0) {
        alert('数据尚未加载完成');
        return;
    }

    const checkedIds = Array.from(document.querySelectorAll('.compare-check:checked'))
        .map(el => Number(el.dataset.id));

    const selected = allVehicles.filter(car => checkedIds.includes(car.id));

    if (selected.length < 2) {
        compareContent.innerHTML = '<p class="text-gray-300">请至少勾选2台载具进行对比</p>';
        compareModal.classList.remove('hidden');
        return;
    }

    // 解析圈速
    const lapTimes = selected.map(car => parseLapTime(car.lapTime));
    const mountainTimes = selected.map(car => parseLapTime(car.mountainLapTime));

    const fastestLapIndex = findFastestIndex(lapTimes);
    const fastestMountainIndex = findFastestIndex(mountainTimes);

    let html = `<div class="overflow-x-auto"><table class="w-full text-sm">
    <thead>
        <tr class="border-b border-slate-600">
            <th class="p-2 text-left">项目</th>`;

    selected.forEach(c => {
        html += `<th class="p-2">${c.name}</th>`;
    });

    html += `</tr>
    </thead>
    <tbody>`;

    // 通用渲染函数：支持高亮最快圈速
    function renderRow(label, values, fastestIndex) {
        html += `<tr class="border-b border-slate-700">
            <td class="p-2 font-bold">${label}</td>`;

        values.forEach((val, index) => {
            if (index === fastestIndex) {
                html += `<td class="p-2 text-green-400 font-bold">${val}</td>`;
            } else {
                html += `<td class="p-2">${val}</td>`;
            }
        });

        html += `</tr>`;
    }

    // 普通字段
    const rows = [
        ['DLC', x => x.dlc || '无'],
        ['价格', x => '$' + x.price?.toLocaleString()],
        ['极速', x => x.topSpeed],
        ['加速', x => x.acceleration],
        ['刹车', x => x.braking],
        ['操控', x => x.handling]
    ];

    rows.forEach(([label, fn]) => {
        html += `<tr class="border-b border-slate-700">
            <td class="p-2 font-bold">${label}</td>`;

        selected.forEach(car => {
            html += `<td class="p-2">${fn(car)}</td>`;
        });

        html += `</tr>`;
    });

    // CCGP圈速：最快绿色高亮
    renderRow(
        'CCGP圈速',
        selected.map(car => car.lapTime || '无'),
        fastestLapIndex
    );

    // 山道之王圈速：最快绿色高亮
    renderRow(
        '山道之王圈速',
        selected.map(car => car.mountainLapTime || '无'),
        fastestMountainIndex
    );

    html += `</tbody></table></div>`;

    compareContent.innerHTML = html;
    compareModal.classList.remove('hidden');
}

openCompareBtn.onclick = openComparePanel;

closeCompareBtn.onclick = () => {
    compareModal.classList.add('hidden');
};

compareModal.onclick = e => {
    if (e.target === compareModal) {
        compareModal.classList.add('hidden');
    }
};
