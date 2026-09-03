// 你的仓库真实文件夹
const PATH_DATA = "./data";
const PATH_ASSETS = "./assets";

let allVehicles = [];
let compareList = [];

async function loadData(){
    try {
        const res = await fetch(`${PATH_DATA}/vehicles.json`);
        if(!res.ok){
            throw new Error("HTTP错误：状态码 " + res.status);
        }
        const text = await res.text();
        allVehicles = JSON.parse(text);
        console.log("加载成功，共 " + allVehicles.length + " 辆载具");
        renderList(allVehicles);

        // 数据加载完初始化筛选
        if (typeof updateList === 'function') updateList();
    } catch (e) {
        console.error("数据加载失败：", e);
        alert("载具数据加载失败，请检查 vehicles.json 文件\n\n错误信息：" + e.message);
    }
}

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
        let imgSrc = item.image;
        card.innerHTML = `
            <img 
                src="${imgSrc}" 
                alt="${item.name}" 
                class="h-40 w-full object-cover rounded bg-slate-700" 
                onerror="this.src='${PATH_ASSETS}/image/placeholder.webp'"
                data-id="${item.id}"
                style="cursor:pointer;"
            >
            <h3 class="text-xl mt-2">${item.name}</h3>
            <div class="text-sm text-gray-400 mt-1">类型：${item.typeName}</div>
            <div class="text-sm text-yellow-400">价格：$${item.price.toLocaleString()}</div>
            <div class="mt-2 text-sm">极速:${item.topSpeed}｜加速:${item.acceleration}</div>
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
    if(car.introUrl && car.introUrl.trim() !== ""){
        html += `<p class="mt-2"><b>车辆介绍：</b><a href="${car.introUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-400 underline hover:text-blue-300">点击查看详情</a></p>`;
    }
    document.getElementById('detailContent').innerHTML = html;
    modal.classList.remove('hidden');
}

document.getElementById('closeDetail').addEventListener('click', function(){
    document.getElementById('carDetailModal').classList.add('hidden');
});
document.getElementById('carDetailModal').addEventListener('click', function(e){
    if(e.target === this){
        this.classList.add('hidden');
    }
});
