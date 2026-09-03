let allVehicles = [];
let compareList = [];

// 加载json数据（增强版：增加响应检查 + 原始文本调试）
async function loadData(){
    try {
        const res = await fetch("./data/vehicles.json");

        
        // 检查HTTP状态码
        if(!res.ok){
            throw new Error("HTTP错误：状态码 " + res.status);
        }
        
        // 先读取原始文本，方便调试
        const text = await res.text();
        console.log("=== vehicles.json 原始内容 ===");
        console.log(text);
        console.log("==============================");
        
        // 手动解析JSON，报错信息更精确
        allVehicles = JSON.parse(text);
        console.log("加载成功，共 " + allVehicles.length + " 辆载具");
        
        renderList(allVehicles);
    } catch (e) {
        console.error("数据加载失败：", e);
        alert("载具数据加载失败，请检查 data/vehicles.json 文件是否存在且格式正确\n\n错误信息：" + e.message);
    }
}

// 渲染载具卡片
function renderList(data){
    const dom = document.getElementById("vehicleList");
    dom.innerHTML = "";
    
    if(!data || data.length === 0){
        dom.innerHTML = '<div class="col-span-full text-center text-gray-400 py-10">暂无载具数据</div>';
        return;
    }
    
    data.forEach(item=>{
        const card = document.createElement("div");
        card.className = "bg-slate-800 rounded p-4 border border-slate-700";
        card.innerHTML = `
            <img 
                src="${item.image}" 
                alt="${item.name}" 
                class="h-40 w-full object-cover rounded bg-slate-700" 
                onerror="this.src='./img/placeholder.webp'"
                data-id="${item.id}"
                style="cursor:pointer;"
            >
            <h3 class="text-xl mt-2">${item.name}</h3>
            <div class="text-sm text-gray-400 mt-1">类型：${item.typeName}</div>
            <div class="text-sm text-yellow-400">价格：$${item.price.toLocaleString()}</div>
            <div class="mt-2 text-sm">极速:${item.topSpeed}｜加速:${item.acceleration}</div>
            <!-- 新增：圈速显示 -->
            <div class="mt-2 text-sm">CCGP:${item.lapTime || "无"}｜山道之王:${item.mountainLapTime || "无"}</div>
            <label class="mt-2 flex items-center gap-2 mt-3">
                <input type="checkbox" data-id="${item.id}" class="compare-check">
                <span>加入对比</span>
            </label>
        `;
        card.querySelector("img").addEventListener("click", function(){
            const carId = parseInt(this.getAttribute("data-id"));
            const car = allVehicles.find(v => v.id === carId);
            if (car) openCarDetail(car);
        });
        dom.appendChild(card);
    })
}


window.onload = function(){
    loadData();
}

// 车辆详情弹窗（全局作用域，确保点击事件能调用到）
function openCarDetail(car) {
    const modal = document.getElementById('carDetailModal');
    const detailContent = document.getElementById('detailContent');

    if (!modal || !detailContent) {
        console.error('弹窗容器不存在，请检查HTML的ID是否正确');
        return;
    }

    const html = `
        <img 
            src="${car.image}" 
            alt="${car.name}"
            class="w-full h-64 object-cover rounded-lg mb-4"
            onerror="this.src='./img/placeholder.webp'"
        >
        <h2 class="text-xl font-bold text-white mb-3">${car.name}</h2>
        <div class="space-y-1.5 text-gray-200 text-sm">
            <p><span class="text-gray-400">类型：</span>${car.typeName}</p>
            <p><span class="text-gray-400">DLC：</span>${car.dlc}</p>
            <p><span class="text-gray-400">价格：</span>$${car.price.toLocaleString()}</p>
            <p><span class="text-gray-400">极速：</span>${car.topSpeed}</p>
            <p><span class="text-gray-400">加速：</span>${car.acceleration}</p>
            <p><span class="text-gray-400">刹车：</span>${car.braking}</p>
            <p><span class="text-gray-400">操控：</span>${car.handling}</p>
            <p><span class="text-gray-400">CC圈速：</span>${car.lapTime ? car.lapTime + ' 秒' : '暂无数据'}</p>
            <p><span class="text-gray-400">山道之王圈速：</span>${car.mountainLapTime ? car.mountainLapTime + ' 秒' : '暂无数据'}</p>
            <p><span class="text-gray-400">来源：</span>${car.source}</p>
            <p class="pt-2 mt-2 border-t border-gray-600"><span class="text-gray-400">简介：</span>${car.description}</p>
            ${car.introUrl ? `<p class="mt-2"><span class="text-gray-400">介绍链接：</span><a href="${car.introUrl}" target="_blank" class="text-blue-400 hover:underline">查看详情</a></p>` : ''}
        </div>
    `;

    detailContent.innerHTML = html;
    // 显示弹窗：先加flex布局，再移除hidden
    modal.classList.add('flex');
    modal.classList.remove('hidden');
}

// 页面加载完成后统一初始化
window.onload = function(){
    loadData();

    const modal = document.getElementById('carDetailModal');
    const closeBtn = document.getElementById('closeDetailBtn');

    // 关闭按钮关闭
    if(closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        });
    }

    // 点击遮罩空白处关闭
    if(modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            }
        });
    }

    // ESC键关闭弹窗
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    });
}

