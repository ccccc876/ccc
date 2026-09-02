let allVehicles = [];
let compareList = [];

// 加载json数据
async function loadData(){
    try {
        const res = await fetch("./data/vehicles.json");
        allVehicles = await res.json();
        renderList(allVehicles);
    } catch (e) {
        console.error("数据加载失败：", e);
    }
}

// 渲染载具卡片
function renderList(data){
    const dom = document.getElementById("vehicleList");
    dom.innerHTML = "";
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
            <label class="mt-2 flex items-center gap-2 mt-3">
                <input type="checkbox" data-id="${item.id}" class="compare-check">
                <span>加入对比</span>
            </label>
        `;
        // 绑定点击事件，通过id找车辆，彻底避免转义报错
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

// ====== 车辆详情弹窗功能 ======
function openCarDetail(car){
    const modal = document.getElementById('carDetailModal');
    const imgDom = document.getElementById('detailImg');
    const nameDom = document.getElementById('detailName');
    const contentDom = document.getElementById('detailContent');

    imgDom.src = car.image;
    nameDom.innerText = car.name;

    // 各项参数展示，已新增圈速字段
    contentDom.innerHTML = `
        <p><b>类型：</b>${car.typeName}</p>
        <p><b>DLC：</b>${car.dlc}</p>
        <p><b>价格：</b>$${car.price.toLocaleString()}</p>
        <p><b>极速：</b>${car.topSpeed}</p>
        <p><b>加速：</b>${car.acceleration}</p>
        <p><b>刹车：</b>${car.braking}</p>
        <p><b>操控：</b>${car.handling}</p>
        <p><b>圈速：</b>${car.lapTime ? car.lapTime + ' 秒' : '暂无数据'}</p>
        <p><b>来源：</b>${car.source}</p>
        <p class="mt-3"><b>简介：</b>${car.description}</p>
    `;

    modal.classList.remove('hidden');
}

// 点击关闭按钮，隐藏详情弹窗
document.getElementById('closeDetail').addEventListener('click', function(){
    const modal = document.getElementById('carDetailModal');
    modal.classList.add('hidden');
});
