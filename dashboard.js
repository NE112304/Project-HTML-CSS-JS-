document.addEventListener('DOMContentLoaded', () => {
    updateDashboardStats();
    initCharts();
});

function updateDashboardStats() {
    // Tables
    const tables = DataManager.getAll(STORAGE_KEYS.TABLES);
    const occupiedTables = tables.filter(t => t.status === 'Occupée').length;
    const reservedTables = tables.filter(t => t.status === 'Réservée').length;
    document.getElementById('stats-tables').textContent = `${occupiedTables}/${tables.length}`;

    // Orders
    const orders = DataManager.getAll(STORAGE_KEYS.COMMANDES);
    const activeOrders = orders.filter(o => o.status !== 'Payé').length; // Assuming 'Payé' is complete
    document.getElementById('stats-orders').textContent = activeOrders;

    // Revenue (Mock/Simple calculation from today's paid orders)
    // In a real app we would check dates, here we sum all 'Payé' orders for demo
    const paidOrders = orders.filter(o => o.status === 'Payé');
    const totalRevenue = paidOrders.reduce((sum, order) => sum + order.total, 0);
    document.getElementById('stats-revenue').textContent = formatCurrency(totalRevenue);

    // Reservations
    const reservations = DataManager.getAll(STORAGE_KEYS.RESERVATIONS);
    document.getElementById('stats-reservations').textContent = reservations.length;
}

function initCharts() {
    // 1. Order Status Distribution (Doughnut)
    const orders = DataManager.getAll(STORAGE_KEYS.COMMANDES);
    const statusCounts = {
        'En attente': 0,
        'En cuisine': 0,
        'Servi': 0,
        'Payé': 0
    };

    orders.forEach(o => {
        if (statusCounts[o.status] !== undefined) {
            statusCounts[o.status]++;
        }
    });

    const ctxOrders = document.getElementById('ordersChart').getContext('2d');
    new Chart(ctxOrders, {
        type: 'doughnut',
        data: {
            labels: Object.keys(statusCounts),
            datasets: [{
                data: Object.values(statusCounts),
                backgroundColor: [
                    '#ef4444', // Red (Attente)
                    '#f59e0b', // Amber (Cuisine)
                    '#3b82f6', // Blue (Servi)
                    '#10b981'  // Emerald (Payé)
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                title: {
                    display: true,
                    text: 'Statut des Commandes'
                }
            }
        }
    });

    // 2. Table Status (Pie/PolarArea)
    const tables = DataManager.getAll(STORAGE_KEYS.TABLES);
    const tableStatusCounts = {
        'Disponible': 0,
        'Occupée': 0,
        'Réservée': 0
    };

    tables.forEach(t => {
        if (tableStatusCounts[t.status] !== undefined) {
            tableStatusCounts[t.status]++;
        }
    });

    const ctxTables = document.getElementById('tablesChart').getContext('2d');
    new Chart(ctxTables, {
        type: 'pie',
        data: {
            labels: Object.keys(tableStatusCounts),
            datasets: [{
                data: Object.values(tableStatusCounts),
                backgroundColor: [
                    '#94a3b8', // Slate (Disponible)
                    '#f97316', // Orange (Occupée)
                    '#8b5cf6'  // Violet (Réservée)
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                title: {
                    display: true,
                    text: 'Occupation des Tables'
                }
            }
        }
    });
}
