// Anonymous Rune Registry - Fixed Shared Storage System with Correct Pricing

class AnonymousRuneRegistry {
    constructor() {
        // Application data with CORRECTED PRICING
        this.data = {
            runeTypes: ["Vitesse", "Dégât", "Réduction de dégât", "Réduction de cooldown", "Vol de vie", "Armure", "Vie"],
            rarities: {
                "Commune": { 
                    color: "#6b7280", 
                    fragmentValue: 1, // Valeur inchangée pour les communes
                    runePrice: 3, 
                    dropRate: 85,
                    declarable: false // Cannot be declared by players
                },
                "Rare": { 
                    color: "#3b82f6", 
                    fragmentValue: 10, // CORRECTED: was 18 → now 10 
                    runePrice: 50, // CORRECTED: was 18 → now 50
                    dropRate: 13.99,
                    declarable: true 
                },
                "Épique": { 
                    color: "#8b5cf6", 
                    fragmentValue: 40, // CORRECTED: was 70 → now 40
                    runePrice: 250, // CORRECTED: was 70 → now 250
                    dropRate: 1,
                    declarable: true 
                },
                "Légendaire": { 
                    color: "#f59e0b", 
                    fragmentValue: 100, // CORRECTED: was 180 → now 100
                    runePrice: 500, // CORRECTED: was 180 → now 500
                    dropRate: 0.01,
                    declarable: true 
                }
            },
            fragmentParts: ["1/4", "2/4", "3/4", "4/4"],
            // SHARED STORAGE KEY - Critical fix for multi-user sync
            sharedStorageKey: 'sharedRuneRegistryData',
            // Member data
            members: [],
            // Anonymous inventory aggregated from all members
            anonymousInventory: [],
            // Corps stock for donations and management
            corpsStock: [],
            // Exchange requests (anonymous)
            exchangeRequests: [],
            // Admin authentication
            isAdminAuthenticated: false,
            adminPassword: "0711" // As specified in the data
        };

        // Initialize session ID for conflict resolution
        this.sessionId = Date.now() + '_' + Math.random().toString(36).substr(2, 9);

        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        console.log('Initializing Anonymous Rune Registry with Shared Storage...');
        this.loadSharedData();
        this.initializeDefaultData();
        this.populateSelects();
        this.updateStats();
        this.renderPublicInventory();
        this.renderExchangeRequests();
        this.setupEventListeners();
        
        // Add first fragment input
        setTimeout(() => {
            this.addFragmentInput();
        }, 200);

        // Auto-refresh data every 30 seconds to catch updates
        setInterval(() => {
            this.refreshSharedData();
        }, 30000);
    }

    // CRITICAL FIX: Shared Storage System
    loadSharedData() {
        try {
            const sharedData = localStorage.getItem(this.data.sharedStorageKey);
            if (sharedData) {
                const parsedData = JSON.parse(sharedData);
                
                // Merge data instead of overwriting
                this.data.members = this.mergeArrays(this.data.members, parsedData.members || [], 'id');
                this.data.anonymousInventory = parsedData.anonymousInventory || [];
                this.data.corpsStock = this.mergeArrays(this.data.corpsStock, parsedData.corpsStock || [], 'type_rarity');
                this.data.exchangeRequests = this.mergeArrays(this.data.exchangeRequests, parsedData.exchangeRequests || [], 'id');
                
                console.log('Shared data loaded successfully');
            }
        } catch (error) {
            console.warn('Could not load shared data:', error);
        }
    }

    saveSharedData() {
        try {
            const dataToSave = {
                members: this.data.members,
                anonymousInventory: this.data.anonymousInventory,
                corpsStock: this.data.corpsStock,
                exchangeRequests: this.data.exchangeRequests,
                lastUpdate: new Date().toISOString(),
                sessionId: this.sessionId
            };
            
            // Always merge with existing data before saving
            const existingData = localStorage.getItem(this.data.sharedStorageKey);
            if (existingData) {
                const existing = JSON.parse(existingData);
                
                // Merge members from all sessions
                dataToSave.members = this.mergeArrays(existing.members || [], dataToSave.members, 'id');
                // Merge corps stock
                dataToSave.corpsStock = this.mergeArrays(existing.corpsStock || [], dataToSave.corpsStock, 'type_rarity');
                // Merge exchange requests
                dataToSave.exchangeRequests = this.mergeArrays(existing.exchangeRequests || [], dataToSave.exchangeRequests, 'id');
            }
            
            localStorage.setItem(this.data.sharedStorageKey, JSON.stringify(dataToSave));
            console.log('Shared data saved successfully');
        } catch (error) {
            console.warn('Could not save shared data:', error);
        }
    }

    // Helper function to merge arrays without duplicates
    mergeArrays(arr1, arr2, keyField) {
        const merged = [...arr1];
        
        arr2.forEach(item => {
            const existingIndex = merged.findIndex(existing => {
                if (keyField === 'type_rarity') {
                    return `${existing.type}_${existing.rarity}` === `${item.type}_${item.rarity}`;
                } else if (keyField === 'id') {
                    return existing.id === item.id;
                }
                return false;
            });
            
            if (existingIndex !== -1) {
                // Update existing item
                merged[existingIndex] = item;
            } else {
                // Add new item
                merged.push(item);
            }
        });
        
        return merged;
    }

    // Manual refresh function for users
    refreshSharedData() {
        this.loadSharedData();
        this.updateAnonymousInventory();
        this.updateStats();
        this.renderPublicInventory();
        this.renderExchangeRequests();
        
        if (this.data.isAdminAuthenticated) {
            this.renderCorpsStock();
            this.renderMemberTable();
            this.renderAdminExchanges();
        }
    }

    initializeDefaultData() {
        // Only add default data if no members exist
        if (this.data.members.length === 0) {
            // Sample data with corrected pricing context
            this.data.members = [
                {
                    id: 1,
                    firstName: "Tanjiro",
                    lastName: "Kamado",
                    inventory: [
                        {
                            type: "Dégât",
                            rarity: "Épique",
                            fragments: {"1/4": 2, "2/4": 1, "3/4": 2, "4/4": 1},
                            completeSets: 1
                        },
                        {
                            type: "Vitesse",
                            rarity: "Rare",
                            fragments: {"1/4": 3, "2/4": 2, "3/4": 1, "4/4": 2},
                            completeSets: 1
                        }
                    ]
                },
                {
                    id: 2,
                    firstName: "Zenitsu",
                    lastName: "Agatsuma",
                    inventory: [
                        {
                            type: "Vitesse",
                            rarity: "Légendaire",
                            fragments: {"1/4": 1, "2/4": 0, "3/4": 1, "4/4": 1},
                            completeSets: 0
                        },
                        {
                            type: "Réduction de cooldown",
                            rarity: "Épique",
                            fragments: {"1/4": 4, "2/4": 4, "3/4": 4, "4/4": 4},
                            completeSets: 4
                        }
                    ]
                }
            ];
        }

        if (this.data.corpsStock.length === 0) {
            // Corps stock from donations
            this.data.corpsStock = [
                {
                    type: "Vitesse",
                    rarity: "Commune",
                    fragments: {"1/4": 15, "2/4": 12, "3/4": 10, "4/4": 8},
                    completeSets: 8
                },
                {
                    type: "Dégât",
                    rarity: "Rare",
                    fragments: {"1/4": 8, "2/4": 6, "3/4": 7, "4/4": 5},
                    completeSets: 5
                }
            ];
        }

        if (this.data.exchangeRequests.length === 0) {
            // Sample exchange requests
            this.data.exchangeRequests = [
                {
                    id: 1,
                    type: "Vitesse",
                    rarity: "Rare",
                    part: "2/4",
                    offer: 15,
                    status: "En attente",
                    message: "Recherche urgent pour compléter set",
                    date: new Date().toLocaleDateString('fr-FR')
                },
                {
                    id: 2,
                    type: "Dégât",
                    rarity: "Épique",
                    part: "4/4",
                    offer: 120, // Updated to reflect new pricing (3 fragments épique = 120 points)
                    status: "En cours",
                    message: "Échange contre fragment équivalent",
                    date: new Date().toLocaleDateString('fr-FR')
                }
            ];
        }

        this.updateAnonymousInventory();
        this.saveSharedData();
    }

    // Event Listeners
    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Navigation
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav__btn') || e.target.closest('.nav__btn')) {
                e.preventDefault();
                const button = e.target.classList.contains('nav__btn') ? e.target : e.target.closest('.nav__btn');
                const section = button.getAttribute('data-section');
                if (section) {
                    this.showSection(section);
                }
            }
        });

        // Refresh Data Button
        const refreshButton = document.getElementById('refreshData');
        if (refreshButton) {
            refreshButton.addEventListener('click', () => {
                this.refreshSharedData();
                this.showNotification('Données actualisées !', 'success');
            });
        }

        // Declaration Form
        const declarationForm = document.getElementById('declarationForm');
        if (declarationForm) {
            declarationForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleDeclaration();
            });
        }

        // Add Fragment Button
        document.addEventListener('click', (e) => {
            if (e.target.id === 'addFragment') {
                e.preventDefault();
                this.addFragmentInput();
            }
        });

        // Donation Form (Admin only)
        const donationForm = document.getElementById('donationForm');
        if (donationForm) {
            donationForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleDonation();
            });
        }

        // Exchange Request Form
        const exchangeRequestForm = document.getElementById('exchangeRequestForm');
        if (exchangeRequestForm) {
            exchangeRequestForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleExchangeRequest();
            });
        }

        // Admin Access Form
        const adminAccessForm = document.getElementById('adminAccessForm');
        if (adminAccessForm) {
            adminAccessForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAdminAccess();
            });
        }

        // Filters
        const filterType = document.getElementById('filterType');
        const filterRarity = document.getElementById('filterRarity');
        
        [filterType, filterRarity].forEach(filter => {
            if (filter) {
                filter.addEventListener('change', () => this.renderPublicInventory());
            }
        });

        // Donation calculation with CORRECTED VALUES
        const donationInputs = ['donationRarity', 'donationQuantity'];
        donationInputs.forEach(inputId => {
            const element = document.getElementById(inputId);
            if (element) {
                element.addEventListener('change', () => this.updateDonationCalculation());
            }
        });

        // Admin tabs
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('admin-tab')) {
                e.preventDefault();
                const tabName = e.target.getAttribute('data-tab');
                this.showAdminTab(tabName);
            }
        });

        // Modal events
        this.setupModalEvents();
        
        console.log('Event listeners setup complete');
    }

    setupModalEvents() {
        const modal = document.getElementById('confirmationModal');
        const modalCancel = document.getElementById('modalCancel');

        if (modalCancel) {
            modalCancel.addEventListener('click', () => {
                this.hideModal();
            });
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal();
                }
            });
        }
    }

    // Navigation
    showSection(sectionId) {
        console.log('Showing section:', sectionId);
        
        // Hide all sections
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.classList.remove('section--active');
        });

        // Show selected section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('section--active');
        } else {
            console.error('Section not found:', sectionId);
            return;
        }

        // Update navigation active state
        const navButtons = document.querySelectorAll('.nav__btn');
        navButtons.forEach(btn => {
            btn.classList.remove('nav__btn--active');
        });
        
        const activeButton = document.querySelector(`[data-section="${sectionId}"]`);
        if (activeButton) {
            activeButton.classList.add('nav__btn--active');
        }

        // Refresh data for specific sections
        if (sectionId === 'inventory') {
            this.renderPublicInventory();
        } else if (sectionId === 'exchange') {
            this.renderExchangeRequests();
        } else if (sectionId === 'admin' && this.data.isAdminAuthenticated) {
            this.renderAdminPanel();
        }
    }

    // Admin tabs management
    showAdminTab(tabName) {
        // Hide all admin content sections
        const adminContents = document.querySelectorAll('.admin-content');
        adminContents.forEach(content => {
            content.classList.remove('admin-content--active');
            content.classList.add('hidden');
        });

        // Show selected tab content
        const targetContent = document.getElementById(`admin${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`);
        if (targetContent) {
            targetContent.classList.add('admin-content--active');
            targetContent.classList.remove('hidden');
        }

        // Update tab active state
        const adminTabs = document.querySelectorAll('.admin-tab');
        adminTabs.forEach(tab => {
            tab.classList.remove('admin-tab--active');
        });
        
        const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeTab) {
            activeTab.classList.add('admin-tab--active');
        }

        // Refresh specific tab data
        if (tabName === 'donations') {
            this.renderCorpsStock();
        } else if (tabName === 'members') {
            this.renderMemberTable();
        } else if (tabName === 'exchanges') {
            this.renderAdminExchanges();
        }
    }

    // Populate Select Elements
    populateSelects() {
        const selects = [
            { id: 'filterType', options: this.data.runeTypes },
            { id: 'donationType', options: this.data.runeTypes },
            { id: 'requestType', options: this.data.runeTypes }
        ];

        selects.forEach(({ id, options }) => {
            const select = document.getElementById(id);
            if (select) {
                const firstOption = select.querySelector('option:first-child');
                select.innerHTML = '';
                if (firstOption) {
                    select.appendChild(firstOption);
                }
                
                options.forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option;
                    optionElement.textContent = option;
                    select.appendChild(optionElement);
                });
            }
        });
    }

    // Fragment Management
    addFragmentInput() {
        const container = document.getElementById('fragmentInputs');
        if (!container) {
            console.log('Fragment inputs container not found');
            return;
        }

        const fragmentInput = document.createElement('div');
        fragmentInput.className = 'fragment-input';
        
        fragmentInput.innerHTML = `
            <select class="form-control fragment-type" required>
                <option value="">Type de fragment</option>
                ${this.data.runeTypes.map(type => `<option value="${type}">${type}</option>`).join('')}
            </select>
            <select class="form-control fragment-rarity" required>
                <option value="">Rareté</option>
                ${Object.keys(this.data.rarities).filter(r => this.data.rarities[r].declarable).map(rarity => 
                    `<option value="${rarity}">${rarity} (${this.data.rarities[rarity].fragmentValue} pts)</option>`
                ).join('')}
            </select>
            <select class="form-control fragment-part" required>
                <option value="">Partie</option>
                ${this.data.fragmentParts.map(part => `<option value="${part}">${part}</option>`).join('')}
            </select>
            <input type="number" class="form-control fragment-quantity" placeholder="Qté" min="1" value="1" required>
            <button type="button" class="fragment-input__remove">×</button>
        `;

        // Add remove functionality
        fragmentInput.querySelector('.fragment-input__remove').addEventListener('click', (e) => {
            e.preventDefault();
            fragmentInput.remove();
            this.updateInventorySummary();
        });

        // Add validation for common runes
        const raritySelect = fragmentInput.querySelector('.fragment-rarity');
        raritySelect.addEventListener('change', (e) => {
            if (e.target.value === 'Commune') {
                alert('⚠️ Les fragments Communs sont automatiquement collectés par le Corps !');
                e.target.value = '';
                return;
            }
            this.updateInventorySummary();
        });

        // Add change listeners for summary calculation
        fragmentInput.querySelectorAll('select, input').forEach(element => {
            element.addEventListener('change', () => this.updateInventorySummary());
        });

        container.appendChild(fragmentInput);
        this.updateInventorySummary();
    }

    updateInventorySummary() {
        const fragmentInputs = document.querySelectorAll('.fragment-input');
        let totalFragments = 0;

        fragmentInputs.forEach(input => {
            const quantity = parseInt(input.querySelector('.fragment-quantity').value) || 0;
            const rarity = input.querySelector('.fragment-rarity').value;
            
            if (rarity && this.data.rarities[rarity] && this.data.rarities[rarity].declarable) {
                totalFragments += quantity;
            }
        });

        const totalFragmentCountElement = document.getElementById('totalFragmentCount');
        if (totalFragmentCountElement) totalFragmentCountElement.textContent = totalFragments;
    }

    // Calculate complete sets
    calculateCompleteSets(fragments) {
        const parts = Object.values(fragments);
        return Math.min(...parts);
    }

    // Enhanced Declaration with shared storage
    handleDeclaration() {
        const firstName = document.getElementById('slayerFirstName').value.trim();
        const lastName = document.getElementById('slayerLastName').value.trim();
        const fragmentInputs = document.querySelectorAll('.fragment-input');

        if (!firstName || !lastName) {
            alert('Veuillez remplir le nom et le prénom !');
            return;
        }

        const inventory = {};
        let hasValidFragments = false;
        
        fragmentInputs.forEach(input => {
            const type = input.querySelector('.fragment-type').value;
            const rarity = input.querySelector('.fragment-rarity').value;
            const part = input.querySelector('.fragment-part').value;
            const quantity = parseInt(input.querySelector('.fragment-quantity').value) || 0;
            
            if (type && rarity && part && quantity > 0) {
                if (rarity === 'Commune') {
                    alert('⚠️ Les fragments Communs sont collectés par le Corps !');
                    return;
                }
                
                hasValidFragments = true;
                const key = `${type}_${rarity}`;
                if (!inventory[key]) {
                    inventory[key] = {
                        type,
                        rarity,
                        fragments: {"1/4": 0, "2/4": 0, "3/4": 0, "4/4": 0}
                    };
                }
                inventory[key].fragments[part] += quantity;
            }
        });

        if (!hasValidFragments) {
            alert('Veuillez déclarer au moins un fragment !');
            return;
        }

        const inventoryArray = Object.values(inventory).map(item => {
            item.completeSets = this.calculateCompleteSets(item.fragments);
            return item;
        });

        // Create unique member ID based on name and timestamp to avoid conflicts
        const memberKey = `${firstName}_${lastName}`;
        const existingMemberIndex = this.data.members.findIndex(m => 
            `${m.firstName}_${m.lastName}` === memberKey);
        
        if (existingMemberIndex !== -1) {
            // Update existing member
            this.data.members[existingMemberIndex].inventory = inventoryArray;
            this.data.members[existingMemberIndex].lastUpdate = new Date().toISOString();
        } else {
            // Add new member with unique ID
            const newMember = {
                id: Date.now() + Math.random(), // Ensure uniqueness
                firstName,
                lastName,
                inventory: inventoryArray,
                createdAt: new Date().toISOString(),
                sessionId: this.sessionId
            };
            this.data.members.push(newMember);
        }

        // Update and save to shared storage
        this.updateAnonymousInventory();
        this.saveSharedData();
        this.updateStats();
        
        // Reset form
        this.resetDeclarationForm();
        
        this.showModal(
            'Déclaration Enregistrée',
            `Déclaration de ${firstName} ${lastName} ajoutée au registre partagé ! Votre identité reste confidentielle.`,
            () => {
                this.showSection('home');
                // Immediately refresh to show the new data
                setTimeout(() => this.refreshSharedData(), 500);
            }
        );
    }

    resetDeclarationForm() {
        const form = document.getElementById('declarationForm');
        if (form) form.reset();
        
        const fragmentInputsContainer = document.getElementById('fragmentInputs');
        if (fragmentInputsContainer) fragmentInputsContainer.innerHTML = '';
        
        const totalFragments = document.getElementById('totalFragmentCount');
        if (totalFragments) totalFragments.textContent = '0';

        setTimeout(() => this.addFragmentInput(), 100);
    }

    updateAnonymousInventory() {
        const aggregated = {};
        
        this.data.members.forEach(member => {
            member.inventory.forEach(item => {
                const key = `${item.type}_${item.rarity}`;
                if (aggregated[key]) {
                    this.data.fragmentParts.forEach(part => {
                        aggregated[key].fragments[part] += item.fragments[part];
                    });
                } else {
                    aggregated[key] = {
                        type: item.type,
                        rarity: item.rarity,
                        fragments: { ...item.fragments }
                    };
                }
            });
        });

        this.data.anonymousInventory = Object.values(aggregated).map(item => {
            item.completeSets = this.calculateCompleteSets(item.fragments);
            return item;
        });
    }

    // Statistics
    updateStats() {
        const totalMembers = this.data.members.length;
        const totalFragments = this.data.anonymousInventory.reduce((sum, item) => 
            sum + Object.values(item.fragments).reduce((a, b) => a + b, 0), 0
        );
        const totalCorpsFragments = this.data.corpsStock.reduce((sum, item) => 
            sum + Object.values(item.fragments).reduce((a, b) => a + b, 0), 0
        );
        const totalExchanges = this.data.exchangeRequests.length;

        const elements = {
            totalMembers: document.getElementById('totalMembers'),
            totalFragments: document.getElementById('totalFragments'),
            totalCorpsFragments: document.getElementById('totalCorpsFragments'),
            totalExchanges: document.getElementById('totalExchanges')
        };

        if (elements.totalMembers) elements.totalMembers.textContent = totalMembers;
        if (elements.totalFragments) elements.totalFragments.textContent = totalFragments;
        if (elements.totalCorpsFragments) elements.totalCorpsFragments.textContent = totalCorpsFragments;
        if (elements.totalExchanges) elements.totalExchanges.textContent = totalExchanges;
    }

    // Public Inventory Rendering
    renderPublicInventory() {
        const tbody = document.querySelector('#publicInventoryTable tbody');
        if (!tbody) return;

        const typeFilter = document.getElementById('filterType')?.value || '';
        const rarityFilter = document.getElementById('filterRarity')?.value || '';

        let filteredInventory = this.data.anonymousInventory.filter(item => {
            const matchesType = !typeFilter || item.type === typeFilter;
            const matchesRarity = !rarityFilter || item.rarity === rarityFilter;
            return matchesType && matchesRarity;
        });

        if (filteredInventory.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center">Aucune donnée disponible</td></tr>';
            return;
        }

        tbody.innerHTML = filteredInventory.map(item => {
            const rarityClass = item.rarity.toLowerCase().replace('é', 'e');
            
            return `
                <tr>
                    <td>${item.type}</td>
                    <td><span class="rune-tag rune-tag--${rarityClass}">${item.rarity}</span></td>
                    <td><span class="fragment-count">${item.fragments['1/4']}</span></td>
                    <td><span class="fragment-count">${item.fragments['2/4']}</span></td>
                    <td><span class="fragment-count">${item.fragments['3/4']}</span></td>
                    <td><span class="fragment-count">${item.fragments['4/4']}</span></td>
                    <td><span class="complete-sets">${item.completeSets}</span></td>
                </tr>
            `;
        }).join('');
    }

    // Donation System with CORRECTED VALUES
    updateDonationCalculation() {
        const rarity = document.getElementById('donationRarity')?.value;
        const quantity = parseInt(document.getElementById('donationQuantity')?.value) || 0;
        const donationPointsElement = document.getElementById('donationPoints');
        
        if (rarity && this.data.rarities[rarity] && donationPointsElement) {
            const points = this.data.rarities[rarity].fragmentValue * quantity;
            donationPointsElement.textContent = `${points} points`;
        } else if (donationPointsElement) {
            donationPointsElement.textContent = '0 points';
        }
    }

    handleDonation() {
        if (!this.data.isAdminAuthenticated) {
            alert('Accès administrateur requis !');
            return;
        }

        const type = document.getElementById('donationType')?.value;
        const rarity = document.getElementById('donationRarity')?.value;
        const part = document.getElementById('donationPart')?.value;
        const quantity = parseInt(document.getElementById('donationQuantity')?.value) || 0;

        if (!type || !rarity || !part || quantity <= 0) {
            alert('Veuillez remplir tous les champs !');
            return;
        }

        const pointsGained = this.data.rarities[rarity].fragmentValue * quantity;
        
        this.showModal(
            'Confirmer le Don au Corps',
            `Confirmer l'ajout de ${quantity}x ${type} ${rarity} (${part}) au stock du Corps ?\nPoints attribués au donateur: ${pointsGained}`,
            () => {
                const stockKey = `${type}_${rarity}`;
                let stockItem = this.data.corpsStock.find(item => 
                    `${item.type}_${item.rarity}` === stockKey);
                
                if (!stockItem) {
                    stockItem = {
                        type,
                        rarity,
                        fragments: {"1/4": 0, "2/4": 0, "3/4": 0, "4/4": 0},
                        completeSets: 0
                    };
                    this.data.corpsStock.push(stockItem);
                }
                
                stockItem.fragments[part] += quantity;
                stockItem.completeSets = this.calculateCompleteSets(stockItem.fragments);
                
                this.saveSharedData();
                this.updateStats();
                this.renderCorpsStock();
                
                const form = document.getElementById('donationForm');
                if (form) form.reset();
                
                const donationPoints = document.getElementById('donationPoints');
                if (donationPoints) donationPoints.textContent = '0 points';
                
                alert(`Don enregistré ! ${pointsGained} points attribués au donateur.`);
            }
        );
    }

    renderCorpsStock() {
        const tbody = document.querySelector('#corpsStockTable tbody');
        if (!tbody) return;
        
        if (this.data.corpsStock.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center">Aucun stock disponible</td></tr>';
            return;
        }
        
        tbody.innerHTML = this.data.corpsStock.map(item => {
            const rarityClass = item.rarity.toLowerCase().replace('é', 'e');
            return `
                <tr>
                    <td>${item.type}</td>
                    <td><span class="rune-tag rune-tag--${rarityClass}">${item.rarity}</span></td>
                    <td><span class="fragment-count">${item.fragments['1/4']}</span></td>
                    <td><span class="fragment-count">${item.fragments['2/4']}</span></td>
                    <td><span class="fragment-count">${item.fragments['3/4']}</span></td>
                    <td><span class="fragment-count">${item.fragments['4/4']}</span></td>
                    <td>
                        <button class="btn btn--danger btn--sm" onclick="registry.removeCorpsFragment('${item.type}', '${item.rarity}')">
                            Retirer
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    removeCorpsFragment(type, rarity) {
        if (!this.data.isAdminAuthenticated) return;

        const stockKey = `${type}_${rarity}`;
        const stockItem = this.data.corpsStock.find(item => 
            `${item.type}_${item.rarity}` === stockKey);
        
        if (!stockItem) return;

        const minCount = Math.min(...Object.values(stockItem.fragments).filter(count => count > 0));
        if (minCount > 0) {
            this.showModal(
                'Retirer des Fragments',
                `Retirer 1 de chaque partie de ${type} ${rarity} ? (Utilisation/Forge)`,
                () => {
                    this.data.fragmentParts.forEach(part => {
                        if (stockItem.fragments[part] > 0) {
                            stockItem.fragments[part] -= 1;
                        }
                    });
                    stockItem.completeSets = this.calculateCompleteSets(stockItem.fragments);
                    
                    if (Object.values(stockItem.fragments).every(count => count === 0)) {
                        const index = this.data.corpsStock.indexOf(stockItem);
                        this.data.corpsStock.splice(index, 1);
                    }
                    
                    this.saveSharedData();
                    this.updateStats();
                    this.renderCorpsStock();
                    alert('Fragments retirés du stock.');
                }
            );
        }
    }

    // Exchange System
    handleExchangeRequest() {
        const type = document.getElementById('requestType')?.value;
        const rarity = document.getElementById('requestRarity')?.value;
        const part = document.getElementById('requestPart')?.value;
        const offer = parseInt(document.getElementById('offerPoints')?.value) || 0;
        const message = document.getElementById('requestMessage')?.value || '';

        if (!type || !rarity || !part || offer <= 0) {
            alert('Veuillez remplir les champs requis !');
            return;
        }

        const newRequest = {
            id: Date.now() + Math.random(), // Ensure uniqueness across sessions
            type,
            rarity,
            part,
            offer,
            message,
            status: 'En attente',
            date: new Date().toLocaleDateString('fr-FR'),
            sessionId: this.sessionId
        };

        this.data.exchangeRequests.push(newRequest);
        this.saveSharedData();
        this.updateStats();
        this.renderExchangeRequests();

        const form = document.getElementById('exchangeRequestForm');
        if (form) form.reset();

        alert('Demande d\'échange postée avec succès ! Le Corps traitera votre demande de façon anonyme.');
    }

    renderExchangeRequests() {
        const container = document.getElementById('exchangeRequestsList');
        if (!container) return;
        
        if (this.data.exchangeRequests.length === 0) {
            container.innerHTML = '<p style="color: var(--color-text-secondary)">Aucune demande d\'échange active.</p>';
            return;
        }

        container.innerHTML = this.data.exchangeRequests.map(request => `
            <div class="exchange-request-item">
                <div class="exchange-request-header">
                    <span class="exchange-request-type">${request.type} ${request.rarity} (${request.part})</span>
                    <span class="exchange-request-offer">${request.offer} points</span>
                </div>
                <div class="anonymous-badge">
                    👤 Demande Anonyme
                </div>
                ${request.message ? `<div class="exchange-request-message">"${request.message}"</div>` : ''}
                <small style="color: var(--color-text-secondary)">Posté le ${request.date} • ${request.status}</small>
            </div>
        `).join('');
    }

    // Admin System
    handleAdminAccess() {
        const password = document.getElementById('adminPassword')?.value;
        
        if (password === this.data.adminPassword) {
            this.data.isAdminAuthenticated = true;
            this.renderAdminPanel();
            
            const accessControl = document.querySelector('.access-control');
            const adminPanel = document.getElementById('adminPanel');
            
            if (accessControl) accessControl.style.display = 'none';
            if (adminPanel) adminPanel.classList.remove('hidden');
            
        } else {
            alert('Code d\'accès incorrect !');
        }
    }

    renderAdminPanel() {
        if (!this.data.isAdminAuthenticated) return;
        this.showAdminTab('donations');
    }

    renderMemberTable() {
        const tbody = document.querySelector('#memberTable tbody');
        if (!tbody) return;
        
        tbody.innerHTML = this.data.members.map(member => `
            <tr>
                <td><strong>${member.firstName}</strong></td>
                <td><strong>${member.lastName}</strong></td>
                <td>${this.renderMemberFragments(member.inventory)}</td>
                <td>
                    <button class="btn btn--secondary btn--sm" onclick="registry.viewMemberDetails(${member.id})">
                        Détails
                    </button>
                </td>
            </tr>
        `).join('');
    }

    renderMemberFragments(inventory) {
        return inventory.map(item => {
            const rarityClass = item.rarity.toLowerCase().replace('é', 'e');
            const fragmentCounts = this.data.fragmentParts.map(part => 
                `${part}:${item.fragments[part]}`).join(' ');
            return `<span class="rune-tag rune-tag--${rarityClass}" title="${fragmentCounts}">${item.type} (${item.completeSets} sets)</span>`;
        }).join(' ');
    }

    renderAdminExchanges() {
        const container = document.getElementById('adminExchangesList');
        if (!container) return;
        
        if (this.data.exchangeRequests.length === 0) {
            container.innerHTML = '<p style="color: var(--color-text-secondary)">Aucune demande d\'échange.</p>';
            return;
        }

        container.innerHTML = this.data.exchangeRequests.map(request => `
            <div class="exchange-request-item">
                <div class="exchange-request-header">
                    <span class="exchange-request-type">${request.type} ${request.rarity} (${request.part})</span>
                    <span class="exchange-request-offer">${request.offer} points</span>
                </div>
                <div style="color: var(--color-text-secondary); font-size: var(--font-size-sm);">
                    ID: ${request.id} • ${request.date} • ${request.status}
                </div>
                ${request.message ? `<div class="exchange-request-message">"${request.message}"</div>` : ''}
                <div style="margin-top: var(--space-8);">
                    <button class="btn btn--primary btn--sm" onclick="registry.processExchange('${request.id}')">
                        Marquer comme Traité
                    </button>
                    <button class="btn btn--danger btn--sm" onclick="registry.deleteExchange('${request.id}')">
                        Supprimer
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Modal System
    showModal(title, message, onConfirm) {
        const modal = document.getElementById('confirmationModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalMessage = document.getElementById('modalMessage');
        const modalConfirm = document.getElementById('modalConfirm');

        if (modal && modalTitle && modalMessage && modalConfirm) {
            modalTitle.textContent = title;
            modalMessage.textContent = message;
            modal.classList.remove('hidden');

            modalConfirm.onclick = null;
            
            modalConfirm.onclick = () => {
                this.hideModal();
                if (onConfirm) onConfirm();
            };
        }
    }

    hideModal() {
        const modal = document.getElementById('confirmationModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    // Notification system
    showNotification(message, type = 'info') {
        // Create a simple notification
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--ds-dark-gray);
            color: var(--ds-white);
            padding: 16px 24px;
            border-radius: 8px;
            border-left: 4px solid var(--ds-red);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            transition: all 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Admin Functions (exposed globally)
    viewMemberDetails(memberId) {
        const member = this.data.members.find(m => m.id == memberId);
        if (member) {
            const inventoryDetails = member.inventory.map(item => {
                const fragmentDetails = this.data.fragmentParts.map(part => 
                    `${part}: ${item.fragments[part]}`).join(', ');
                return `${item.type} ${item.rarity} (${fragmentDetails}) - ${item.completeSets} sets complets`;
            }).join('\n');
            
            const details = `Nom: ${member.firstName} ${member.lastName}\n\nInventaire:\n${inventoryDetails}`;
            alert(details);
        }
    }

    processExchange(requestId) {
        if (!this.data.isAdminAuthenticated) return;

        const request = this.data.exchangeRequests.find(r => r.id == requestId);
        if (request) {
            request.status = 'Traité';
            this.saveSharedData();
            this.renderAdminExchanges();
            this.updateStats();
            alert('Demande d\'échange marquée comme traitée.');
        }
    }

    deleteExchange(requestId) {
        if (!this.data.isAdminAuthenticated) return;

        const requestIndex = this.data.exchangeRequests.findIndex(r => r.id == requestId);
        if (requestIndex !== -1) {
            this.showModal(
                'Supprimer la Demande',
                'Confirmer la suppression de cette demande d\'échange ?',
                () => {
                    this.data.exchangeRequests.splice(requestIndex, 1);
                    this.saveSharedData();
                    this.renderAdminExchanges();
                    this.updateStats();
                    alert('Demande d\'échange supprimée.');
                }
            );
        }
    }
}

// Initialize and expose globally
let registry;

document.addEventListener('DOMContentLoaded', () => {
    registry = new AnonymousRuneRegistry();
});
