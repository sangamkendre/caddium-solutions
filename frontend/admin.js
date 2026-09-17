let currentLeads = [];

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();

    // Wire backdrop click to close product modal
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeProductModal();
            }
        });
    }

    // Wire Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeProductModal();
        }
    });

    // Wire Add Product button click
    const addBtn = document.getElementById('btn-open-add-product');
    if (addBtn) {
        addBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openAddProductModal();
        });
    }
});

function checkAuth() {
    const savedPassword = sessionStorage.getItem('adminPassword');
    if (savedPassword) {
        document.getElementById('login-modal').classList.add('hidden');
        document.getElementById('dashboard-container').classList.remove('hidden');
        fetchLeads();
    }
}

function handleLogin(e) {
    e.preventDefault();
    const password = document.getElementById('admin-password').value;
    sessionStorage.setItem('adminPassword', password);
    
    // Attempt fetch to verify password
    fetchLeads().then(success => {
        if (success) {
            document.getElementById('login-modal').classList.add('hidden');
            document.getElementById('dashboard-container').classList.remove('hidden');
            document.getElementById('login-error').classList.add('hidden');
        } else {
            sessionStorage.removeItem('adminPassword');
            document.getElementById('login-error').classList.remove('hidden');
        }
    });
}

function logout() {
    sessionStorage.removeItem('adminPassword');
    document.getElementById('dashboard-container').classList.add('hidden');
    document.getElementById('login-modal').classList.remove('hidden');
    document.getElementById('admin-password').value = '';
}

async function fetchLeads() {
    const tableBody = document.getElementById('leads-table-body');
    const password = sessionStorage.getItem('adminPassword');
    
    if(!password) return false;

    tableBody.innerHTML = `<tr>
        <td colspan="6" class="px-6 py-8 text-center text-gray-400">
            <i class="fa-solid fa-spinner fa-spin mr-2"></i> Loading requests...
        </td>
    </tr>`;

    try {
        const response = await fetch('/api/consultations', {
            headers: { 'x-admin-password': password }
        });
        const result = await response.json();

        if (response.ok && result.success) {
            currentLeads = result.data;
            renderTable(result.data);
            return true;
        } else {
            if(response.status === 401) {
                // Unauthorized
                return false;
            }
            showError("Failed to fetch leads.");
            return true; // Password was right, just a server error
        }
    } catch (error) {
        console.error("Error fetching leads:", error);
        showError("An error occurred while fetching leads.");
        return true;
    }
}

async function deleteLead(id) {
    if (!confirm('Are you sure you want to delete this consultation request?')) {
        return;
    }

    const password = sessionStorage.getItem('adminPassword');
    try {
        const response = await fetch(`/api/consultations/${id}`, {
            method: 'DELETE',
            headers: { 'x-admin-password': password }
        });
        const result = await response.json();

        if (response.ok && result.success) {
            fetchLeads();
        } else {
            alert('Failed to delete lead: ' + (result.message || 'Unknown error'));
        }
    } catch (error) {
        console.error("Error deleting lead:", error);
        alert('An error occurred while deleting the lead.');
    }
}

function renderTable(leads) {
    const tableBody = document.getElementById('leads-table-body');
    
    if (!leads || leads.length === 0) {
        tableBody.innerHTML = `<tr>
            <td colspan="6" class="px-6 py-12 text-center text-gray-400">
                <div class="mb-3 text-4xl text-gray-600"><i class="fa-solid fa-inbox"></i></div>
                <p>No consultation requests found.</p>
            </td>
        </tr>`;
        return;
    }

    leads.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    let html = '';
    leads.forEach(lead => {
        const date = new Date(lead.timestamp).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });

        let urgencyColor = 'bg-gray-500/20 text-gray-300 border-gray-500/30';
        if (lead.urgency === 'High' || lead.urgency === 'Immediate') {
            urgencyColor = 'bg-red-500/20 text-red-400 border-red-500/30';
        } else if (lead.urgency === 'Medium') {
            urgencyColor = 'bg-amber-500/20 text-amber-400 border-amber-500/30';
        } else if (lead.urgency === 'Low') {
            urgencyColor = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
        }

        const techTags = (lead.technologies || []).map(t => {
            let color = 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
            if (t.includes('Data')) color = 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
            else if (t.includes('Software')) color = 'bg-amber-500/10 text-amber-300 border-amber-500/30';
            else if (t.includes('AI')) color = 'bg-purple-500/10 text-purple-300 border-purple-500/30';
            return `<span class="inline-block px-2 py-0.5 ${color} text-[11px] font-semibold rounded border mr-1 mb-1">${t}</span>`;
        }).join('');

        html += `
            <tr class="hover:bg-white/[0.02] transition">
                <td class="px-6 py-4 whitespace-nowrap text-xs font-mono text-gray-400">${date}</td>
                <td class="px-6 py-4">
                    <div class="font-bold text-white">${lead.clientName}</div>
                    <div class="text-xs text-cyan-400"><a href="mailto:${lead.email}">${lead.email}</a></div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-300">${lead.company}</td>
                <td class="px-6 py-4 text-sm text-gray-300">
                    <div class="mb-1 line-clamp-2" title="${lead.goals}">${lead.goals}</div>
                    <div class="mt-1">${techTags}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2.5 py-1 rounded-full text-xs font-medium border ${urgencyColor}">
                        ${lead.urgency}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                    <button onclick="deleteLead('${lead.id}')" class="text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded text-sm transition">
                        <i class="fa-solid fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `;
    });

    tableBody.innerHTML = html;
}

function showError(message) {
    const tableBody = document.getElementById('leads-table-body');
    tableBody.innerHTML = `<tr>
        <td colspan="6" class="px-6 py-8 text-center text-red-400">
            <i class="fa-solid fa-circle-exclamation mr-2"></i> ${message}
        </td>
    </tr>`;
}

function downloadCSV() {
    if (!currentLeads || currentLeads.length === 0) {
        alert("No data available to download.");
        return;
    }

    // Define CSV headers
    const headers = ['Date', 'Client Name', 'Email', 'Company', 'Technologies', 'Goals', 'Urgency'];
    
    // Create CSV rows
    const rows = currentLeads.map(lead => {
        const date = new Date(lead.timestamp).toLocaleString('en-US');
        const techs = (lead.technologies || []).join('; ');
        
        // Escape quotes and wrap in quotes for CSV formatting
        return [
            date,
            lead.clientName,
            lead.email,
            lead.company,
            techs,
            lead.goals,
            lead.urgency
        ].map(value => {
            const stringValue = String(value || '');
            const escaped = stringValue.replace(/"/g, '""');
            return `"${escaped}"`;
        }).join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `consultation_leads_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// --- PRODUCT MANAGER LOGIC ---
let currentProducts = [];

function switchAdminTab(tab) {
    const leadsView = document.getElementById('view-leads');
    const productsView = document.getElementById('view-products');
    const tabLeadsBtn = document.getElementById('nav-tab-leads');
    const tabProductsBtn = document.getElementById('nav-tab-products');

    if (tab === 'leads') {
        leadsView.classList.remove('hidden');
        productsView.classList.add('hidden');
        tabLeadsBtn.className = "px-4 py-2 rounded-lg transition bg-cyan-500 text-black font-extrabold shadow";
        tabProductsBtn.className = "px-4 py-2 rounded-lg transition text-gray-300 hover:text-white";
        fetchLeads();
    } else {
        leadsView.classList.add('hidden');
        productsView.classList.remove('hidden');
        tabProductsBtn.className = "px-4 py-2 rounded-lg transition bg-cyan-500 text-black font-extrabold shadow";
        tabLeadsBtn.className = "px-4 py-2 rounded-lg transition text-gray-300 hover:text-white";
        fetchAdminProducts();
    }
}

async function fetchAdminProducts() {
    const tableBody = document.getElementById('products-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = `<tr>
        <td colspan="5" class="px-6 py-8 text-center text-gray-400">
            <i class="fa-solid fa-spinner fa-spin mr-2"></i> Loading products directory...
        </td>
    </tr>`;

    try {
        const response = await fetch('/api/products');
        const result = await response.json();

        if (response.ok && result.success) {
            currentProducts = result.data || [];
            renderProductsTable(currentProducts);
        } else {
            tableBody.innerHTML = `<tr><td colspan="5" class="px-6 py-6 text-center text-red-400">Failed to load products</td></tr>`;
        }
    } catch (err) {
        console.error("Error loading products:", err);
        tableBody.innerHTML = `<tr><td colspan="5" class="px-6 py-6 text-center text-red-400">Error fetching products</td></tr>`;
    }
}

function renderProductsTable(products) {
    const tableBody = document.getElementById('products-table-body');
    if (!tableBody) return;

    if (!products || products.length === 0) {
        tableBody.innerHTML = `<tr>
            <td colspan="5" class="px-6 py-12 text-center text-gray-400">
                <div class="mb-3 text-4xl text-gray-600"><i class="fa-solid fa-box-open"></i></div>
                <p>No products published yet. Click "Add New Product" to create your first listing!</p>
            </td>
        </tr>`;
        return;
    }

    let html = '';
    products.forEach(p => {
        let badgeColor = 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
        if (p.pillar === 'data') badgeColor = 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
        else if (p.pillar === 'software') badgeColor = 'bg-amber-500/10 text-amber-300 border-amber-500/30';
        else if (p.pillar === 'ai') badgeColor = 'bg-purple-500/10 text-purple-300 border-purple-500/30';

        const highlights = (p.highlights || []).slice(0, 2).map(h => `<div class="text-[11px] text-gray-400">• ${h}</div>`).join('');
        const tags = (p.techTags || []).map(t => `<span class="inline-block px-2 py-0.5 bg-slate-900 border border-white/10 text-gray-300 text-[10px] font-mono rounded mr-1 mb-1">${t}</span>`).join('');

        html += `
            <tr class="hover:bg-white/[0.02] transition">
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-3 py-1 rounded-full text-xs font-bold border ${badgeColor}">
                        ${p.pillarLabel || p.pillar}
                    </span>
                </td>
                <td class="px-6 py-4">
                    <div class="font-extrabold text-white text-sm">${p.name}</div>
                    <div class="text-xs text-gray-400 mt-0.5">${p.tagline || ''}</div>
                </td>
                <td class="px-6 py-4">
                    <a href="${p.liveUrl}" target="_blank" class="text-cyan-400 hover:underline font-mono text-xs flex items-center gap-1.5">
                        <span class="truncate max-w-[200px]">${p.liveUrl}</span>
                        <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                    </a>
                    <span class="text-[10px] text-emerald-400 font-semibold block mt-1"><i class="fa-solid fa-circle text-[6px]"></i> ${p.status || 'Live'}</span>
                </td>
                <td class="px-6 py-4">
                    <div class="mb-1">${highlights}</div>
                    <div>${tags}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                    <button onclick="deleteAdminProduct('${p.id}')" class="text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg text-xs font-bold transition">
                        <i class="fa-solid fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `;
    });

    tableBody.innerHTML = html;
}

function openAddProductModal() {
    const modal = document.getElementById('product-modal');
    if (!modal) return;
    modal.style.display = 'flex';
    // Force layout reflow
    void modal.offsetWidth;
    modal.classList.remove('opacity-0');
    modal.classList.add('opacity-100', 'show-modal');
    
    // Focus first input
    const nameInput = document.getElementById('prod-name');
    if (nameInput) setTimeout(() => nameInput.focus(), 50);
}

function closeProductModal() {
    const modal = document.getElementById('product-modal');
    if (!modal) return;
    modal.classList.remove('opacity-100', 'show-modal');
    modal.classList.add('opacity-0');
    setTimeout(() => {
        modal.style.display = 'none';
        const form = document.getElementById('product-form');
        if (form) form.reset();
    }, 200);
}

async function handleSaveProduct(e) {
    e.preventDefault();
    const password = sessionStorage.getItem('adminPassword');
    if (!password) {
        alert("Session expired. Please log in again.");
        return;
    }

    const payload = {
        name: document.getElementById('prod-name').value.trim(),
        pillar: document.getElementById('prod-pillar').value,
        status: document.getElementById('prod-status').value.trim() || "Live Production App",
        liveUrl: document.getElementById('prod-url').value.trim(),
        tagline: document.getElementById('prod-tagline').value.trim(),
        description: document.getElementById('prod-desc').value.trim(),
        highlights: document.getElementById('prod-highlights').value.split('\n').filter(Boolean),
        techTags: document.getElementById('prod-tags').value.split(',').map(t => t.trim()).filter(Boolean)
    };

    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-admin-password': password
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (response.ok && result.success) {
            closeProductModal();
            fetchAdminProducts();
        } else {
            alert("Error saving product: " + (result.message || "Unknown error"));
        }
    } catch (err) {
        console.error("Failed to save product:", err);
        alert("Networking error occurred while saving product.");
    }
}

async function deleteAdminProduct(id) {
    if (!confirm("Are you sure you want to delete this product from the CADDium platform?")) {
        return;
    }

    const password = sessionStorage.getItem('adminPassword');
    try {
        const response = await fetch(`/api/products/${id}`, {
            method: 'DELETE',
            headers: {
                'x-admin-password': password
            }
        });

        const result = await response.json();
        if (response.ok && result.success) {
            fetchAdminProducts();
        } else {
            alert("Error deleting product: " + (result.message || "Unknown error"));
        }
    } catch (err) {
        console.error("Failed to delete product:", err);
        alert("Error occurred while deleting product.");
    }
}
