document.addEventListener('DOMContentLoaded', function () {
    const compareBtn = document.getElementById("openCompareBtn");
    const compareModal = document.getElementById("compareModal");
    const closeCompare = document.getElementById("closeCompare");
    const compareContent = document.getElementById("compareContent");

    // 圈速解析工具函数，和排序逻辑保持一致
    function parseLapTime(timeStr) {
        if (!timeStr || typeof timeStr !== 'string') return 9999;
        if (!timeStr.includes(':')) {
            const sec = parseFloat(timeStr);
            return isNaN(sec) ? 9999 : sec;
        }
        const parts = timeStr.split(':');
        const min = parseFloat(parts[0]);
        const sec = parseFloat(parts[1]);
        if (isNaN(min) || isNaN(sec)) return 9999;
        return min * 60 + sec;
    }

    // 点击对比按钮
    compareBtn.onclick = function () {
        // 数据未加载完成时容错
        if (!allVehicles || allVehicles.length === 0) {
            alert("载具数据尚未加载完成，请稍候再试");
            return;
        }

        // 获取所有勾选的载具
        const checks = document.querySelectorAll(".compare-check:checked");
        const ids = Array.from(checks).map(el => Number(el.dataset.id));
        const selected = allVehicles.filter(v => ids.includes(v.id));

        if (selected.length < 2) {
            alert("请至少勾选2台载具进行对比");
            return;
        }

        // 计算最优圈速
        const bestLap = Math.min(...selected.map(v => parseLapTime(v.lapTime)));

        // 生成对比表格
        let html = `
        <div class="overflow-x-auto">
            <table class="w-full text-sm border-collapse rounded-xl overflow-hidden">
                <thead>
                    <tr>
                        <th class="border border-slate-600 p-4 w-28 align-middle bg-slate-800 text-left font-normal">参数</th>
                        ${selected.map(i => `
                        <th class="border border-slate-600 p-4 bg-slate-800 font-normal">
                            <div class="rounded-xl overflow-hidden mb-3 bg-slate-700">
                                <img src="${i.image}" alt="${i.name}" class="w-full h-auto object-cover">
                            </div>
                            <div class="text-base text-white">${i.name}</div>
                        </th>
                        `).join("")}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="border border-slate-600 p-3 bg-slate-800">价格</td>
                        ${selected.map(i => `<td class="border border-slate-600 p-3 text-yellow-400 bg-slate-900">$${i.price.toLocaleString()}</td>`).join("")}
                    </tr>
                    <tr>
                        <td class="border border-slate-600 p-3 bg-slate-800">极速</td>
                        ${selected.map(i => `<td class="border border-slate-600 p-3 bg-slate-900">${i.topSpeed}</td>`).join("")}
                    </tr>
                    <tr>
                        <td class="border border-slate-600 p-3 bg-slate-800">加速</td>
                        ${selected.map(i => `<td class="border border-slate-600 p-3 bg-slate-900">${i.acceleration}</td>`).join("")}
                    </tr>
                    <tr>
                        <td class="border border-slate-600 p-3 bg-slate-800">刹车</td>
                        ${selected.map(i => `<td class="border border-slate-600 p-3 bg-slate-900">${i.braking}</td>`).join("")}
                    </tr>
                    <tr>
                        <td class="border border-slate-600 p-3 bg-slate-800">操控</td>
                        ${selected.map(i => `<td class="border border-slate-600 p-3 bg-slate-900">${i.handling}</td>`).join("")}
                    </tr>
                    <tr>
                        <td class="border border-slate-600 p-3 bg-slate-800">赛道圈速</td>
                        ${selected.map(i => {
                            const isBest = parseLapTime(i.lapTime) === bestLap;
                            return `<td class="border border-slate-600 p-3 bg-slate-900 ${isBest ? 'text-green-400 font-semibold' : ''}">${i.lapTime || '无'}</td>`;
                        }).join("")}
                    </tr>
					<tr>
					    <td class="border border-slate-600 p-3 bg-slate-800">山道之王圈速</td>
					    ${selected.map(i => `<td class="border border-slate-600 p-3 bg-slate-900">${i.mountainLapTime || '无'}</td>`).join("")}
					</tr>
                </tbody>
            </table>
        </div>
        `;
        compareContent.innerHTML = html;
        compareModal.classList.remove("hidden");
    }

    // 关闭按钮
    closeCompare.onclick = function () {
        compareModal.classList.add("hidden");
    }

    // 点击弹窗遮罩也能关闭
    compareModal.addEventListener('click', function (e) {
        if (e.target === compareModal) {
            compareModal.classList.add("hidden");
        }
    });
});
