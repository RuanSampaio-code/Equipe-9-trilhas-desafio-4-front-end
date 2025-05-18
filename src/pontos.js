document.addEventListener('DOMContentLoaded', async () => {{
    const rechargeContainer = document.getElementById('recharge-points');

    async function getRechargePoints() {
        const res = await fetch('https://express-api-h6xd.onrender.com/ponto-recarga');
        const data = await res.json();
        
        return data;
    }

    const rechargePoints = await getRechargePoints();
    rechargeContainer.innerHTML = '';

    for (const rechargePoint of rechargePoints) {
        const card = gerenateRechargeCard(rechargePoint);
        rechargeContainer.appendChild(card)
    }

}})


function gerenateRechargeCard(rechargePoint) {
    const card = document.createElement('div');
    card.innerHTML = `
    <div class="bg-white p-6 rounded-lg shadow-md" style="min-height:200px">
        <div class="flex items-start">
            <div class="bg-blue-lighter p-3 rounded-full mr-4">
                <i class="fas fa-map-marker-alt text-blue-medium text-xl"></i>
            </div>
            <div>
                <h3 class="text-xl font-bold text-blue-dark mb-2">${rechargePoint.name}</h3>
                <p class="text-gray-600 mb-2">${rechargePoint.address}</p>
                <p class="text-gray-600 mb-2">${rechargePoint.time}</p>
                <a href="${rechargePoint.link}" target="_blank" class="text-blue-medium hover:text-blue-light flex items-center">
                    <i class="fas fa-map mr-2"></i> Ver no mapa
                </a>
            </div>
        </div>
    </div>   
    `;
    return card;
}