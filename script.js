
const STORAGE_KEYS = {
    PLATS: 'restaurant_plats',
    COMMANDES: 'restaurant_commandes',
    TABLES: 'restaurant_tables',
    RESERVATIONS: 'restaurant_reservations',
    EMPLOYES: 'restaurant_employes'
};

//Mock Data
const MOCK_DATA = {
    plats: [
        { id: 1, nom: 'Salade César', prix: 12.50, category: 'Entrée', description: 'Laitue romaine, croûtons, parmesan' },
        { id: 2, nom: 'Bœuf Bourguignon', prix: 18.00, category: 'Plat Principal', description: 'Bœuf mijoté au vin rouge' },
        { id: 3, nom: 'Tarte Tatin', prix: 8.00, category: 'Dessert', description: 'Tarte aux pommes caramélisées' }
    ],
    tables: [
        { id: 1, numero: 'T1', capacite: 2, status: 'Disponible' },
        { id: 2, numero: 'T2', capacite: 4, status: 'Occupée' },
        { id: 3, numero: 'T3', capacite: 6, status: 'Réservée' }
    ],
    employes: [
        { id: 1, nom: 'Jean Dupont', poste: 'Serveur', shift: 'Matin' },
        { id: 2, nom: 'Marie Curry', poste: 'Chef', shift: 'Soir' }
    ],
    reservations: [],
    commandes: []
};

// Data Manager
const DataManager = {
    init() {
        // Initialize storage if empty
        if (!localStorage.getItem(STORAGE_KEYS.PLATS)) {
            this.save(STORAGE_KEYS.PLATS, MOCK_DATA.plats);
        }
        if (!localStorage.getItem(STORAGE_KEYS.TABLES)) {
            this.save(STORAGE_KEYS.TABLES, MOCK_DATA.tables);
        }
        if (!localStorage.getItem(STORAGE_KEYS.EMPLOYES)) {
            this.save(STORAGE_KEYS.EMPLOYES, MOCK_DATA.employes);
        }
    },

    getAll(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    },

    save(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },

    add(key, item) {
        const items = this.getAll(key);
        item.id = Date.now(); // Simple ID generation
        items.push(item);
        this.save(key, items);
        return item;
    },

    update(key, updatedItem) {
        const items = this.getAll(key);
        const index = items.findIndex(i => i.id === updatedItem.id);
        if (index !== -1) {
            items[index] = updatedItem;
            this.save(key, items);
        }
    },

    delete(key, id) {
        let items = this.getAll(key);
        items = items.filter(i => i.id !== id);
        this.save(key, items);
    }
};

// data on load
DataManager.init();
document.addEventListener('DOMContentLoaded', () => {
    createDetailsModal();
});

// Modal Logic
function createDetailsModal() {
    if (document.getElementById('detailsModal')) return;

    const modalHtml = `
    <div id="detailsModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="detailsModalTitle">Détails</h3>
                <button class="close-modal" onclick="closeDetailsModal()">&times;</button>
            </div>
            <div id="detailsModalBody">
                <!-- Details will be here -->
            </div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // Close on click outside
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('detailsModal');
        if (event.target == modal) {
            closeDetailsModal();
        }
    });
}

function closeDetailsModal() {
    const modal = document.getElementById('detailsModal');
    if (modal) modal.classList.remove('active');
}

function openDetailsModal(title, data) {
    const modal = document.getElementById('detailsModal');
    const titleEl = document.getElementById('detailsModalTitle');
    const bodyEl = document.getElementById('detailsModalBody');

    if (!modal) return;

    titleEl.textContent = title;

    let tableHtml = '<table class="details-table">';
    for (const [key, value] of Object.entries(data)) {
        // Format key (camelCase to Title Case)
        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        tableHtml += `
            <tr>
                <th>${label}</th>
                <td>${value}</td>
            </tr>
        `;
    }
    tableHtml += '</table>';

    bodyEl.innerHTML = tableHtml;
    modal.classList.add('active');
}


//format currency
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(amount);
};
