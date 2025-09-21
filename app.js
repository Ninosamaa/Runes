// Anonymous Rune Registry - Demon Slayer Application with Fixed Navigation

class AnonymousRuneRegistry {
    constructor() {
        // Application data from provided JSON
        this.data = {
            runeTypes: ["Armure", "Dégât", "Réduction de cooldown", "Réduction de dégât", "Vie", "Vitesse", "Vol de vie"],
            rarities: {
                "Commune": { 
                    color: "#6b7280", 
                    fragmentValue: 1, 
                    runePrice: 3, 
                    dropRate: 85,
                    declarable: false // Cannot be declared by players
                },
                "Rare": { 
                    color: "#3b82f6", 
                    fragmentValue: 10, 
                    runePrice: 18, 
                    dropRate: 13.99,
                    declarable: true 
                },
                "Épique": { 
                    color: "#8b5cf6", 
                    fragmentValue: 40, 
                    runePrice: 70, 
                    dropRate: 1,
                    declarable: true 
                },
                "Légendaire": { 
                    color: "#f59e0b", 
                    fragmentValue: 100, 
                    runePrice: 180, 
                    dropRate: 0.01,
                    declarable: true 
                }
            },
            // Only declarable rarities for the interface
            declarableRarities: ["Rare", "Épique", "Légendaire"],
            rarityOrder: ["Rare", "Épique", "Légendaire"], // Order for display
            fragmentParts: ["1/4", "2/4", "3/4", "4/4"],
            // Member data
            members: [],
            // Complete inventory with all combinations
            completeInventory: [],
            // Admin authentication
            isAdminAuthenticated: false,
            adminPassword: "0711",
            // Activity logs
            activityLogs: [],
            // Current editing member
            currentEditingMemberId: null
        };

        // Initialize when DOM is ready
        this.init();
    }

    init() {
        console.log('Initializing Anonymous Rune Registry...');
        
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        console.log('Setting up application...');
        this.loadData();
        this.initializeDefaultData();
        this.setupEventListeners();
        this.populateSelects();
        this.updateStats();
        this.generateCompleteInventory();
        this.renderPublicInventory();
        
        // Add first fragment input after a brief delay
        setTimeout(() => {
            this.addFragmentInput();
        }, 100);
        
        console.log('Application setup complete');
    }

    // Data Management
    loadData() {
        try {
            const savedData = localStorage.getItem('anonymousRuneRegistry');
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                this.data.members = parsedData.members || [];
                this.data.activityLogs = parsedData.activityLogs || [];
            }
        } catch (error) {
            console.warn('Could not load saved data:', error);
        }
    }

    saveData() {
        try {
            const dataToSave = {
                members: this.data.members,
                activityLogs: this.data.activityLogs
            };
            localStorage.setItem('anonymousRuneRegistry', JSON.stringify(dataToSave));
        } catch (error) {
            console.warn('Could not save data:', error);
        }
    }

    addLog(action, details) {
        const log = {
            id: Date.now(),
            timestamp: new Date().toLocaleString('fr-FR'),
            action,
            details
        };
        this.data.activityLogs.unshift(log);
        // Keep only last 100 logs
        if (this.data.activityLogs.length > 100) {
            this.data.activityLogs = this.data.activityLogs.slice(0, 100);
        }
        this.saveData();
    }

    initializeDefaultData() {
        if (this.data.members.length === 0) {
            // Sample data from provided JSON
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
                    ],
                    points: 240
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
                        }
                    ],
                    points: 300
                }
            ];
            
            this.addLog('SYSTEM', 'Application initialisée avec données d\'exemple');
        }

        this.saveData();
    }

    // Event Listeners - Fixed Implementation
    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Navigation - Fixed with proper event handling
        const navButtons = document.querySelectorAll('.nav__btn');
        console.log('Found navigation buttons:', navButtons.length);
        
        navButtons.forEach((btn) => {
            const section = btn.getAttribute('data-section');
            console.log('Setting up navigation for:', section);
            
            // Remove any existing listeners
            btn.removeEventListener('click', this.handleNavClick);
            
            // Add new listener with proper scope
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Navigation clicked:', section);
                this.showSection(section);
            });
        });

        // Form event listeners
        this.setupFormListeners();
        
        // Modal event listeners
        this.setupModalListeners();
        
        console.log('Event listeners setup complete');
    }

    setupFormListeners() {
        // Confidential Declaration Form
        const confidentialForm = document.getElementById('confidentialForm');
        if (confidentialForm) {
            confidentialForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleConfidentialDeclaration();
            });
        }

        // Add Fragment Button
        const addFragmentBtn = document.getElementById('addFragment');
        if (addFragmentBtn) {
            addFragmentBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.addFragmentInput();
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
        
        if (filterType) {
            filterType.addEventListener('change', () => this.renderPublicInventory());
        }
        
        if (filterRarity) {
            filterRarity.addEventListener('change', () => this.renderPublicInventory());
        }
    }

    setupModalListeners() {
        const modal = document.getElementById('confirmationModal');
        const modalCancel = document.getElementById('modalCancel');
        
        const memberEditModal = document.getElementById('memberEditModal');
        const memberEditCancel = document.getElementById('memberEditCancel');
        const memberEditSave = document.getElementById('memberEditSave');

        if (modalCancel) {
            modalCancel.addEventListener('click', () => this.hideModal('confirmationModal'));
        }

        if (memberEditCancel) {
            memberEditCancel.addEventListener('click', () => this.hideModal('memberEditModal'));
        }

        if (memberEditSave) {
            memberEditSave.addEventListener('click', () => this.saveMemberEdit());
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.hideModal('confirmationModal');
            });
        }

        if (memberEditModal) {
            memberEditModal.addEventListener('click', (e) => {
                if (e.target === memberEditModal) this.hideModal('memberEditModal');
            });
        }
    }

    // Navigation - Fixed Implementation
    showSection(sectionId) {
        console.log('Showing section:', sectionId);
        
        // Hide all sections
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.classList.remove('section--active');
            console.log('Hiding section:', section.id);
        });

        // Show selected section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('section--active');
            console.log('Showing section:', sectionId);
        } else {
            console.error('Section not found:', sectionId);
        }

        // Update navigation active state
        const navButtons = document.querySelectorAll('.nav__btn');
        navButtons.forEach(btn => btn.classList.remove('nav__btn--active'));
        
        const activeButton = document.querySelector(`[data-section="${sectionId}"]`);
        if (activeButton) {
            activeButton.classList.add('nav__btn--active');
        }

        // Refresh data for specific sections
        if (sectionId === 'inventory') {
            this.generateCompleteInventory();
            this.renderPublicInventory();
        } else if (sectionId === 'admin' && this.data.isAdminAuthenticated) {
            this.renderAdminPanel();
        } else if (sectionId === 'admin' && !this.data.isAdminAuthenticated) {
            // Reset admin panel if not authenticated
            const accessControl = document.querySelector('.access-control');
            const adminPanel = document.getElementById('adminPanel');
            
            if (accessControl) accessControl.style.display = 'block';
            if (adminPanel) adminPanel.classList.add('hidden');
        }
    }

    // Populate Select Elements
    populateSelects() {
        // Filter select
        const filterType = document.getElementById('filterType');
        if (filterType) {
            // Clear existing options (except the first "all types" option)
            while (filterType.children.length > 1) {
                filterType.removeChild(filterType.lastChild);
            }
            
            this.data.runeTypes.forEach(type => {
                const option = document.createElement('option');
                option.value = type;
                option.textContent = type;
                filterType.appendChild(option);
            });
        }
    }

    // Fragment Management with RESTRICTION
    addFragmentInput() {
        const container = document.getElementById('fragmentInputs');
        if (!container) {
            console.error('Fragment inputs container not found');
            return;
        }

        const fragmentInput = document.createElement('div');
        fragmentInput.className = 'fragment-input';
        
        // Only show declarable rarities (NO COMMUNE)
        const rarityOptions = this.data.declarableRarities.map(rarity => 
            `<option value="${rarity}">${rarity}</option>`
        ).join('');

        fragmentInput.innerHTML = `
            <select class="form-control fragment-type" required>
                <option value="">Type de fragment</option>
                ${this.data.runeTypes.map(type => `<option value="${type}">${type}</option>`).join('')}
            </select>
            <select class="form-control fragment-rarity" required>
                <option value="">Rareté</option>
                ${rarityOptions}
            </select>
            <select class="form-control fragment-part" required>
                <option value="">Partie</option>
                ${this.data.fragmentParts.map(part => `<option value="${part}">${part}</option>`).join('')}
            </select>
            <input type="number" class="form-control fragment-quantity" placeholder="Qté" min="1" value="1" required>
            <button type="button" class="fragment-input__remove">×</button>
        `;

        // Add remove functionality
        const removeBtn = fragmentInput.querySelector('.fragment-input__remove');
        removeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            fragmentInput.remove();
            this.updateInventorySummary();
        });

        // Add change listeners for summary calculation
        fragmentInput.querySelectorAll('select, input').forEach(element => {
            element.addEventListener('change', () => this.updateInventorySummary());
        });

        container.appendChild(fragmentInput);
        this.updateInventorySummary();
        
        console.log('Fragment input added');
    }

    updateInventorySummary() {
        const fragmentInputs = document.querySelectorAll('.fragment-input');
        let totalPoints = 0;
        let totalFragments = 0;

        fragmentInputs.forEach(input => {
            const rarity = input.querySelector('.fragment-rarity').value;
            const quantity = parseInt(input.querySelector('.fragment-quantity').value) || 0;
            
            if (rarity && this.data.rarities[rarity]) {
                totalPoints += this.data.rarities[rarity].fragmentValue * quantity;
                totalFragments += quantity;
            }
        });

        const totalPointsElement = document.getElementById('totalInventoryPoints');
        const totalFragmentCountElement = document.getElementById('totalFragmentCount');

        if (totalPointsElement) totalPointsElement.textContent = totalPoints;
        if (totalFragmentCountElement) totalFragmentCountElement.textContent = totalFragments;
    }

    // Calculate complete sets (minimum of all 4 parts)
    calculateCompleteSets(fragments) {
        const parts = Object.values(fragments);
        return Math.min(...parts);
    }

    // Generate Complete Inventory (ALL combinations) - ALPHABETICAL ORDER
    generateCompleteInventory() {
        const completeInventory = [];
        
        // Create all combinations in STRICT alphabetical order
        this.data.runeTypes.forEach(type => {
            // For each type, add rarities in order: Rare → Épique → Légendaire
            this.data.rarityOrder.forEach(rarity => {
                completeInventory.push({
                    type,
                    rarity,
                    fragments: {"1/4": 0, "2/4": 0, "3/4": 0, "4/4": 0},
                    completeSets: 0
                });
            });
        });

        // Now overlay actual member data
        this.data.members.forEach(member => {
            member.inventory.forEach(item => {
                const index = completeInventory.findIndex(inv => 
                    inv.type === item.type && inv.rarity === item.rarity
                );
                if (index !== -1) {
                    // Add fragments from this member
                    this.data.fragmentParts.forEach(part => {
                        completeInventory[index].fragments[part] += item.fragments[part];
                    });
                    completeInventory[index].completeSets = this.calculateCompleteSets(completeInventory[index].fragments);
                }
            });
        });

        this.data.completeInventory = completeInventory;
        console.log('Complete inventory generated with', completeInventory.length, 'entries');
    }

    // Confidential Declaration
    handleConfidentialDeclaration() {
        const firstName = document.getElementById('slayerFirstName').value.trim();
        const lastName = document.getElementById('slayerLastName').value.trim();
        const fragmentInputs = document.querySelectorAll('.fragment-input');

        if (!firstName || !lastName) {
            alert('Veuillez remplir le nom et le prénom !');
            return;
        }

        const inventory = {};
        
        // Process fragment inputs
        fragmentInputs.forEach(input => {
            const type = input.querySelector('.fragment-type').value;
            const rarity = input.querySelector('.fragment-rarity').value;
            const part = input.querySelector('.fragment-part').value;
            const quantity = parseInt(input.querySelector('.fragment-quantity').value) || 0;
            
            if (type && rarity && part && quantity > 0) {
                // Additional check - should not happen with restricted UI
                if (!this.data.rarities[rarity].declarable) {
                    alert('⚠️ Erreur : Les fragments Communs ne peuvent pas être déclarés !');
                    return;
                }
                
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

        const inventoryArray = Object.values(inventory).map(item => {
            item.completeSets = this.calculateCompleteSets(item.fragments);
            return item;
        });

        if (inventoryArray.length === 0) {
            alert('Veuillez déclarer au moins un fragment !');
            return;
        }

        // Calculate total points
        const totalPoints = inventoryArray.reduce((sum, item) => {
            const fragmentTotal = Object.values(item.fragments).reduce((a, b) => a + b, 0);
            return sum + (this.data.rarities[item.rarity].fragmentValue * fragmentTotal);
        }, 0);

        // Check if member already exists
        const existingMemberIndex = this.data.members.findIndex(m => 
            m.firstName === firstName && m.lastName === lastName);
        
        if (existingMemberIndex !== -1) {
            // Update existing member
            this.data.members[existingMemberIndex].inventory = inventoryArray;
            this.data.members[existingMemberIndex].points = totalPoints;
            this.addLog('UPDATE', `Déclaration mise à jour: ${firstName} ${lastName} (${totalPoints} pts)`);
        } else {
            // Add new member
            const newMember = {
                id: Date.now(),
                firstName,
                lastName,
                inventory: inventoryArray,
                points: totalPoints
            };
            this.data.members.push(newMember);
            this.addLog('DECLARATION', `Nouvelle déclaration: ${firstName} ${lastName} (${totalPoints} pts)`);
        }

        this.saveData();
        this.updateStats();
        
        // Reset form
        this.resetConfidentialForm();
        
        this.showModal(
            'Déclaration Enregistrée',
            `Déclaration de ${firstName} ${lastName} enregistrée avec succès ! Votre identité reste confidentielle.`,
            () => {
                this.showSection('home');
            }
        );
    }

    resetConfidentialForm() {
        const form = document.getElementById('confidentialForm');
        if (form) form.reset();
        
        const fragmentInputsContainer = document.getElementById('fragmentInputs');
        if (fragmentInputsContainer) fragmentInputsContainer.innerHTML = '';
        
        const totalPoints = document.getElementById('totalInventoryPoints');
        const totalFragments = document.getElementById('totalFragmentCount');
        
        if (totalPoints) totalPoints.textContent = '0';
        if (totalFragments) totalFragments.textContent = '0';

        // Add a new fragment input
        setTimeout(() => this.addFragmentInput(), 100);
    }

    // Statistics
    updateStats() {
        const totalMembers = this.data.members.length;
        const totalFragments = this.data.members.reduce((sum, member) => 
            sum + member.inventory.reduce((memberSum, item) => 
                memberSum + Object.values(item.fragments).reduce((a, b) => a + b, 0), 0
            ), 0
        );
        const totalPoints = this.data.members.reduce((sum, member) => sum + member.points, 0);
        const totalExchanges = 0; // No exchange system in simplified version

        const elements = {
            totalMembers: document.getElementById('totalMembers'),
            totalFragments: document.getElementById('totalFragments'),
            totalPoints: document.getElementById('totalPoints'),
            totalExchanges: document.getElementById('totalExchanges')
        };

        if (elements.totalMembers) elements.totalMembers.textContent = totalMembers;
        if (elements.totalFragments) elements.totalFragments.textContent = totalFragments;
        if (elements.totalPoints) elements.totalPoints.textContent = totalPoints;
        if (elements.totalExchanges) elements.totalExchanges.textContent = totalExchanges;
    }

    // Public Inventory Rendering - COMPLETE with all combinations in ALPHABETICAL ORDER
    renderPublicInventory() {
        const tbody = document.querySelector('#publicInventoryTable tbody');
        if (!tbody) {
            console.error('Public inventory table body not found');
            return;
        }

        this.generateCompleteInventory(); // Ensure it's up to date

        const typeFilter = document.getElementById('filterType')?.value || '';
        const rarityFilter = document.getElementById('filterRarity')?.value || '';

        let filteredInventory = this.data.completeInventory.filter(item => {
            const matchesType = !typeFilter || item.type === typeFilter;
            const matchesRarity = !rarityFilter || item.rarity === rarityFilter;
            return matchesType && matchesRarity;
        });

        console.log(`Rendering ${filteredInventory.length} inventory items`);

        tbody.innerHTML = filteredInventory.map(item => {
            const rarityClass = item.rarity.toLowerCase().replace('é', 'e');
            const forgeAvailable = item.completeSets > 0;
            const hasAnyFragments = Object.values(item.fragments).some(count => count > 0);
            const rowClass = hasAnyFragments ? '' : 'zero-row';
            
            return `
                <tr class="${rowClass}">
                    <td>${item.type}</td>
                    <td><span class="rune-tag rune-tag--${rarityClass}">${item.rarity}</span></td>
                    <td><span class="fragment-count ${item.fragments['1/4'] === 0 ? 'zero' : ''}">${item.fragments['1/4']}</span></td>
                    <td><span class="fragment-count ${item.fragments['2/4'] === 0 ? 'zero' : ''}">${item.fragments['2/4']}</span></td>
                    <td><span class="fragment-count ${item.fragments['3/4'] === 0 ? 'zero' : ''}">${item.fragments['3/4']}</span></td>
                    <td><span class="fragment-count ${item.fragments['4/4'] === 0 ? 'zero' : ''}">${item.fragments['4/4']}</span></td>
                    <td>
                        <span class="complete-sets ${item.completeSets === 0 ? 'zero' : ''}">
                            ${item.completeSets}
                            ${forgeAvailable ? '<span class="forge-badge">Forge Possible</span>' : ''}
                        </span>
                    </td>
                    <td>${this.data.rarities[item.rarity].fragmentValue} pts</td>
                </tr>
            `;
        }).join('');
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
            
            this.addLog('ADMIN', 'Accès administrateur autorisé');
        } else {
            alert('Code d\'accès incorrect !');
        }
    }

    renderAdminPanel() {
        if (!this.data.isAdminAuthenticated) return;
        this.renderMemberTable();
    }

    renderMemberTable() {
        const tbody = document.querySelector('#memberTable tbody');
        if (!tbody) return;
        
        tbody.innerHTML = this.data.members.map(member => `
            <tr>
                <td><strong>${member.firstName}</strong></td>
                <td><strong>${member.lastName}</strong></td>
                <td>${this.renderMemberFragments(member.inventory)}</td>
                <td><strong>${member.points} pts</strong></td>
                <td>
                    <button class="btn btn--secondary btn--sm" onclick="registry.editMember(${member.id})">
                        Éditer
                    </button>
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

    // Member editing functionality
    editMember(memberId) {
        const member = this.data.members.find(m => m.id === memberId);
        if (!member) return;

        const modal = document.getElementById('memberEditModal');
        const content = document.getElementById('memberEditContent');
        
        if (!modal || !content) return;

        content.innerHTML = `
            <h4>Édition: ${member.firstName} ${member.lastName}</h4>
            <div class="member-inventory-edit">
                ${member.inventory.map((item, index) => this.renderInventoryItemEdit(item, index)).join('')}
            </div>
            <button type="button" class="btn btn--secondary btn--sm" onclick="registry.addNewInventoryItem()">
                + Ajouter un type de fragment
            </button>
        `;

        modal.classList.remove('hidden');
        this.currentEditingMemberId = memberId;
    }

    renderInventoryItemEdit(item, index) {
        const rarityClass = item.rarity.toLowerCase().replace('é', 'e');
        return `
            <div class="member-inventory-item" data-index="${index}">
                <div class="inventory-item-header">
                    <span class="inventory-item-title rune-tag rune-tag--${rarityClass}">${item.type} ${item.rarity}</span>
                    <button type="button" class="btn btn--secondary btn--sm" onclick="registry.removeInventoryItem(${index})">
                        Supprimer
                    </button>
                </div>
                <div class="fragment-controls">
                    ${this.data.fragmentParts.map(part => `
                        <div class="fragment-control">
                            <label>${part}</label>
                            <div class="quantity-controls">
                                <button type="button" class="quantity-btn" onclick="registry.adjustQuantity(${index}, '${part}', -1)">-</button>
                                <input type="number" min="0" value="${item.fragments[part]}" 
                                       onchange="registry.updateQuantity(${index}, '${part}', this.value)" 
                                       style="width: 50px; text-align: center;">
                                <button type="button" class="quantity-btn" onclick="registry.adjustQuantity(${index}, '${part}', 1)">+</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <small style="color: var(--color-text-secondary)">Sets complets: <span id="sets-${index}">${item.completeSets}</span></small>
            </div>
        `;
    }

    adjustQuantity(itemIndex, part, delta) {
        const member = this.data.members.find(m => m.id === this.currentEditingMemberId);
        if (!member || !member.inventory[itemIndex]) return;

        const newValue = Math.max(0, member.inventory[itemIndex].fragments[part] + delta);
        member.inventory[itemIndex].fragments[part] = newValue;
        
        // Update complete sets
        member.inventory[itemIndex].completeSets = this.calculateCompleteSets(member.inventory[itemIndex].fragments);
        
        // Update display
        const input = document.querySelector(`[data-index="${itemIndex}"] input[onchange*="'${part}'"]`);
        if (input) input.value = newValue;
        
        const setsSpan = document.getElementById(`sets-${itemIndex}`);
        if (setsSpan) setsSpan.textContent = member.inventory[itemIndex].completeSets;
    }

    updateQuantity(itemIndex, part, value) {
        const member = this.data.members.find(m => m.id === this.currentEditingMemberId);
        if (!member || !member.inventory[itemIndex]) return;

        const newValue = Math.max(0, parseInt(value) || 0);
        member.inventory[itemIndex].fragments[part] = newValue;
        
        // Update complete sets
        member.inventory[itemIndex].completeSets = this.calculateCompleteSets(member.inventory[itemIndex].fragments);
        
        const setsSpan = document.getElementById(`sets-${itemIndex}`);
        if (setsSpan) setsSpan.textContent = member.inventory[itemIndex].completeSets;
    }

    removeInventoryItem(itemIndex) {
        const member = this.data.members.find(m => m.id === this.currentEditingMemberId);
        if (!member) return;

        member.inventory.splice(itemIndex, 1);
        this.editMember(this.currentEditingMemberId); // Refresh the edit modal
    }

    addNewInventoryItem() {
        const member = this.data.members.find(m => m.id === this.currentEditingMemberId);
        if (!member) return;

        // Simple prompt for demo - in a real app you'd want a proper form
        const type = prompt('Type de rune:', this.data.runeTypes[0]);
        const rarity = prompt('Rareté (Rare/Épique/Légendaire):', this.data.declarableRarities[0]);

        if (type && rarity && this.data.runeTypes.includes(type) && this.data.rarities[rarity]) {
            const newItem = {
                type,
                rarity,
                fragments: {"1/4": 0, "2/4": 0, "3/4": 0, "4/4": 0},
                completeSets: 0
            };
            member.inventory.push(newItem);
            this.editMember(this.currentEditingMemberId); // Refresh the edit modal
        }
    }

    saveMemberEdit() {
        const member = this.data.members.find(m => m.id === this.currentEditingMemberId);
        if (!member) return;

        // Recalculate points
        member.points = member.inventory.reduce((sum, item) => {
            const fragmentTotal = Object.values(item.fragments).reduce((a, b) => a + b, 0);
            return sum + (this.data.rarities[item.rarity].fragmentValue * fragmentTotal);
        }, 0);

        this.addLog('ADMIN_EDIT', `Inventaire modifié: ${member.firstName} ${member.lastName} (${member.points} pts)`);
        
        this.saveData();
        this.updateStats();
        this.renderAdminPanel();
        this.hideModal('memberEditModal');
        
        alert('Modifications sauvegardées avec succès !');
    }

    // Admin utility functions
    viewMemberDetails(memberId) {
        const member = this.data.members.find(m => m.id === memberId);
        if (member) {
            const inventoryDetails = member.inventory.map(item => {
                const fragmentDetails = this.data.fragmentParts.map(part => 
                    `${part}: ${item.fragments[part]}`).join(', ');
                return `${item.type} ${item.rarity} (${fragmentDetails}) - ${item.completeSets} sets complets`;
            }).join('\n');
            
            const details = `Nom: ${member.firstName} ${member.lastName}\nPoints: ${member.points}\n\nInventaire:\n${inventoryDetails}`;
            alert(details);
        }
    }

    exportData() {
        const exportData = {
            members: this.data.members,
            logs: this.data.activityLogs,
            exportDate: new Date().toLocaleString('fr-FR')
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `runes-export-${Date.now()}.json`;
        link.click();
        
        this.addLog('EXPORT', 'Données exportées');
    }

    viewLogs() {
        const logsWindow = window.open('', 'logs', 'width=800,height=600');
        const logsHtml = `
            <html>
                <head><title>Logs d'Activité</title></head>
                <body style="font-family: monospace; padding: 20px; background: #1a1a1a; color: #f8fafc;">
                    <h2 style="color: #fbbf24;">Logs d'Activité</h2>
                    <div>
                        ${this.data.activityLogs.map(log => `
                            <div style="margin: 10px 0; padding: 10px; background: #2a2a2a; border-left: 3px solid #dc2626;">
                                <strong>[${log.timestamp}] ${log.action}:</strong> ${log.details}
                            </div>
                        `).join('')}
                    </div>
                </body>
            </html>
        `;
        logsWindow.document.write(logsHtml);
    }

    adjustInventory() {
        alert('Fonction d\'ajustement d\'inventaire activée. Utilisez les boutons "Éditer" dans le tableau des membres.');
    }

    manageExchanges() {
        alert('Système d\'échange simplifié dans cette version.');
    }

    viewStatistics() {
        const stats = this.generateDetailedStats();
        alert(`Statistiques Détaillées:\n\n${stats}`);
    }

    generateDetailedStats() {
        const totalMembers = this.data.members.length;
        const totalPoints = this.data.members.reduce((sum, member) => sum + member.points, 0);
        const avgPoints = totalMembers > 0 ? Math.round(totalPoints / totalMembers) : 0;
        
        const rarityStats = {};
        this.data.declarableRarities.forEach(rarity => {
            rarityStats[rarity] = 0;
        });
        
        this.data.members.forEach(member => {
            member.inventory.forEach(item => {
                const total = Object.values(item.fragments).reduce((a, b) => a + b, 0);
                rarityStats[item.rarity] += total;
            });
        });
        
        let statsText = `Membres: ${totalMembers}\nPoints totaux: ${totalPoints}\nMoyenne par membre: ${avgPoints}\n\nFragments par rareté:\n`;
        Object.entries(rarityStats).forEach(([rarity, count]) => {
            statsText += `${rarity}: ${count} fragments\n`;
        });
        
        return statsText;
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

            // Remove any existing listeners
            modalConfirm.replaceWith(modalConfirm.cloneNode(true));
            const newModalConfirm = document.getElementById('modalConfirm');

            newModalConfirm.addEventListener('click', () => {
                this.hideModal('confirmationModal');
                if (onConfirm) onConfirm();
            });
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
        }
    }
}

// Global registry instance
let registry;

// Initialize when DOM loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        registry = new AnonymousRuneRegistry();
    });
} else {
    registry = new AnonymousRuneRegistry();
}
