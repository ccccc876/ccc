document.addEventListener('DOMContentLoaded', function () {
    const compareBtn = document.getElementById("openCompareBtn");
    const compareModal = document.getElementById("compareModal");
    const closeCompare = document.getElementById("closeCompare");
    const compareContent = document.getElementById("compareContent");

    // 圈速转秒数工具函数，用于数值对比
    function parseLapTime(timeStr) {
        if (!timeStr) return Infinity;
        const [min, sec] = timeStr.split(':');
        return Number(min) * 60 + Number(sec);
    }

    compareBtn.onclick = function () {
        const checks = document.querySelectorAll(".compare-check:checked");
        const ids = Array.from(checks).map(el => Number(el.dataset.id));
        const selected = allVehicles.filter(v => ids.includes(v.id));

        if (selected.length < 2) {
            alert("请至少勾选2台载具进行对比");
            return;
        }

        // 计算选中载具里的最优圈速（时间最短）
        const bestLap = Math.min(...selected.map(v => parseLapTime(v.lapTime)));

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
                            return `<td class="border border-slate-600 p-3 bg-slate-900 ${isBest ? 'text-green-400 font-semibold' : ''}">${i.lapTime}</td>`;
                        }).join("")}
                    </tr>
                </tbody>
            </table>
        </div>
        `;
        compareContent.innerHTML = html;
        compareModal.classList.remove("hidden");
    }

    closeCompare.onclick = function () {
        compareModal.classList.add("hidden");
    }
});
