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

// 车辆详情弹窗
function openCarDetail(car){
    const modal = document.getElementById('carDetailModal');
    document.getElementById('detailImg').src = car.image;
    document.getElementById('detailName').innerText = car.name;
    
    let html = "";
    html += `<p><b>类型：</b>${car.typeName}</p>`;
    html += `<p><b>DLC：</b>${car.dlc}</p>`;
    html += `<p><b>价格：</b>$${car.price.toLocaleString()}</p>`;
    html += `<p><b>极速：</b>${car.topSpeed}</p>`;
    html += `<p><b>加速：</b>${car.acceleration}</p>`;
    html += `<p><b>刹车：</b>${car.braking}</p>`;
    html += `<p><b>操控：</b>${car.handling}</p>`;
    html += `<p><b>CCGP圈速：</b>${car.lapTime ? car.lapTime + ' 秒' : '暂无数据'}</p>`;
    html += `<p><b>山道之王圈速：</b>${car.mountainLapTime ? car.mountainLapTime + ' 秒' : '暂无数据'}</p>`;
    html += `<p><b>来源：</b>${car.source}</p>`;
    html += `<p class="mt-3"><b>简介：</b>${car.description}</p>`;

    // 车辆介绍链接
    if(car.introUrl && car.introUrl.trim() !== ""){
        html += `<p class="mt-2"><b>车辆介绍：</b><a href="${car.introUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-400 underline hover:text-blue-300">点击查看详情</a></p>`;
    }

    document.getElementById('detailContent').innerHTML = html;
    modal.classList.remove('hidden');
}

// 关闭弹窗事件，保留这两段，不要重复写
document.getElementById('closeDetail').addEventListener('click', function(){
    document.getElementById('carDetailModal').classList.add('hidden');
});

document.getElementById('carDetailModal').addEventListener('click', function(e){
    if(e.target === this){
        this.classList.add('hidden');
    }
});

