document.getElementById('calcForm').addEventListener('submit', function (event) {
    event.preventDefault();

    var physicalDamage = parseFloat(document.getElementById('physdmg').value) || 0;
    var health = parseFloat(document.getElementById('health').value) || 0;
    var combatHeal = parseFloat(document.getElementById('combatHealValue').value) || 0;

    var powefulBlowDamage = calculateDamage(PowerfulBlow(physicalDamage), false, true);
    var waveOfAggroHeal = calculateHeal(WaveOfAggression(health));
    var wardenSpiritShield = WardenSpirit(health);
    var powefulLungeDamage = calculateDamage(PowerfulLunge(physicalDamage));
    var blockMasterHeal = calculateHeal(BlockMaster(health));
    var shieldThrowDamage = calculateDamage(ShieldThrow(physicalDamage));
    var combatHealingDamage = calculateDamage(CombatHealing(combatHeal), true);

    updateDamageValues(powefulBlowDamage, "powerfulBlowRow");
    updateDamageValues(waveOfAggroHeal, "waveOfAggroRow");
    updateDamageValues(wardenSpiritShield, "wardenSpiritRow");
    updateDamageValues(powefulLungeDamage, "powerfulLungeRow");
    updateDamageValues(blockMasterHeal, "blockMasterRow");
    updateDamageValues(shieldThrowDamage, "shieldThrowRow");
    updateDamageValues(combatHealingDamage, "combatHealingRow");
});

function calculateDamage(skillDamageLevels, isTalent=false, isBasicSkill=false) {
    var totalDamageLevels = [];

    var isPVPTarget = document.getElementById('pvpSwitch').checked;

    var penetration = (parseFloat(document.getElementById('penetration').value) || 0) / 100;
    var ferocity = (isPVPTarget ? (parseFloat(document.getElementById('ferocity').value) || 0) / 100 : 0);

    var targetPhysicalDefence = (parseFloat(document.getElementById('targetPhysicalDefencePercent').value) || 0) / 100;

    var targetPhysicalReduction = (penetration > targetPhysicalDefence) ? 0 : targetPhysicalDefence - penetration;
    var targetResilience = (isPVPTarget ? (parseFloat(document.getElementById('targetResilience').value) || 0) / 100 : 0);

    var talentPVEDmgBonusI = (isPVPTarget || isTalent ? 0 : (parseFloat(document.getElementById('pveBonusI').value) || 0) / 100);
    var talentPVEDmgBonusII = (isPVPTarget ? 0 : (parseFloat(document.getElementById('pveBonusII').value) || 0) / 100);

    var castleDmg = (isTalent ? 0 : (parseFloat(document.getElementById('castleDmg').value) || 0) / 100);
    var exclusiveAttackBonus = (isBasicSkill ? (document.getElementById('exclusiveAttackBonus').checked ? 0.10 : 0) : 0);

    for (var level = 0; level < skillDamageLevels.length; level++) {
        var skillDamage = skillDamageLevels[level];
        var totalDamage = skillDamage * (1 - targetPhysicalReduction) * (1 + talentPVEDmgBonusI + talentPVEDmgBonusII) * (1 - targetResilience) * (1 + ferocity) * (1 + castleDmg + exclusiveAttackBonus);
        totalDamage = parseFloat(totalDamage.toFixed(2));

        totalDamageLevels.push(totalDamage);
    }

    return totalDamageLevels;
}

function calculateHeal(skillHealLevels) {
    var totalHealLevels = [];

    var castleHealBonus = (parseFloat(document.getElementById('castleHeal').value) || 0) / 100;
    var healPotBonus = (parseFloat(document.getElementById('healPot').value) || 0) / 100;

    for (var level = 0; level < skillHealLevels.length; level++) {
        var skillHeal = skillHealLevels[level];
        var totalHeal = skillHeal * (1 + castleHealBonus + healPotBonus);
        totalHeal = parseFloat(totalHeal.toFixed(2));

        totalHealLevels.push(totalHeal);
    }

    return totalHealLevels;
}

function PowerfulBlow(physicalDamage){
    var damageLevels = [];

    var baseValues = [20, 40, 60, 80, 100];
    var percentageIncreases = [115.0, 120.0, 125.0, 130.0, 135.0];

    var relicBonus = document.getElementById('relicBonus').checked ? 0.12 : 0;
    var unitedBonus = (parseFloat(document.getElementById('unitedAttackBonus').value) || 0) / 100;

    var powerfulBlowBonus = (parseFloat(document.getElementById('powerfulBlowBonus').value) || 0) / 100;

    for (var level = 0; level < 5; level++) {
        var damage = (baseValues[level] + physicalDamage * (percentageIncreases[level] / 100 + powerfulBlowBonus)) * (1 + relicBonus + unitedBonus);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function WaveOfAggression(health){
    var healLevels = [];

    var percentageIncreases = [4.0, 6.0, 8.0, 10.0, 12.0];

    var waveOfAggroBonus = (parseFloat(document.getElementById('waveOfAggroBonus').value) || 0) / 100;

    for (var level = 0; level < 5; level++) {
        var heal = health * (percentageIncreases[level] / 100 + waveOfAggroBonus);
        healLevels.push(heal);
    }

    return healLevels;
}

function WardenSpirit(maxHealth){
    var shieldLevels = [];

    var damage = (parseFloat(document.getElementById('wardenSpiritDamage').value) || 0);

    var percentageIncreases = [20.0, 30.0, 35.0, 40.0, 50.0];

    var wardenSpiritBonus = document.getElementById('wardenSpiritBonus').checked ? 0.05 : 0;

    for (var level = 0; level < 5; level++) {
        var shield = damage * (percentageIncreases[level] / 100) * (1 + wardenSpiritBonus);
        shield = Math.min(shield, maxHealth * 0.75);
        shieldLevels.push(parseFloat(shield.toFixed(2)));
    }

    return shieldLevels;
}

function PowerfulLunge(physicalDamage){
    var damageLevels = [];

    var percentageIncreases = [125.0, 145.0, 165.0, 190.0];
    var increasePerTargetPercentages = [20.0, 25.0, 30.0, 35.0];
    var numberOfTargets = [3, 4, 5, 6];

    targetsHit = (parseFloat(document.getElementById('targetsHit').value) || 0);

    var powerfulLungeBonus = (parseFloat(document.getElementById('powerfulLungeBonus').value) || 0) / 100;
    var powerfulLungeBonusII = document.getElementById('powerfulLungeBonusII').checked ? 0.08 : 0;

    for (var level = 0; level < 4; level++) {
        var targets = Math.min(targetsHit, numberOfTargets[level]);

        var baseDamage = physicalDamage * (percentageIncreases[level] / 100 + powerfulLungeBonus + powerfulLungeBonusII);

        var damage;
        if (targets > 1) {
            damage = (baseDamage * (increasePerTargetPercentages[level] / 100) * targets) / targets;
        } else {
            damage = baseDamage;
        }
        
        damageLevels.push(damage);
    }

    return damageLevels;
}

function BlockMaster(health){
    var healLevels = [];

    var percentageIncreases = [2.0, 4.0, 6.0, 8.0];
    var perStackIncreases = [2.0, 2.5, 3.0, 4.0];

    var stacks = (parseFloat(document.getElementById('masterBlockStacks').value) || 0);

    var blockMasterBonusI = document.getElementById('blockMasterBonusI').checked ? 0.003 : 0;
    var blockMasterBonusIII = document.getElementById('blockMasterBonusIII').checked ? 0.02 : 0;

    for (var level = 0; level < 4; level++) {
        var baseHeal = health * (percentageIncreases[level] / 100 + blockMasterBonusI); //830
        var stackHeal = (health * (perStackIncreases[level] / 100) * stacks) * (1 + blockMasterBonusIII);

        healLevels.push(baseHeal + stackHeal);
    }

    return healLevels;
}

function ShieldThrow(physicalDamage){
    var damageLevels = [];

    var percentageIncreases = [115.0, 120.0, 130.0, 140.0];


    for (var level = 0; level < 4; level++) {
        var damage = physicalDamage * (percentageIncreases[level] / 100);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function CombatHealing(combatHealValue){
    var damageLevels = [];

    var percentageIncrease = 40.0;

    var targetHealth = parseFloat(document.getElementById('targetHealth').value) || 0;

    var damage = combatHealValue * (percentageIncrease / 100);
    damage = Math.min(damage, targetHealth * 0.25);

    damageLevels.push(damage);

    return damageLevels;
}

function updateDamageValues(damageList, rowId) {
    var row = document.getElementById(rowId);

    if (row) {
        for (var i = 0; i < damageList.length; i++) {
            if (i + 1 < row.cells.length) {
                row.cells[i + 1].innerText = damageList[i];
            } else {
                console.warn('More damage values than available cells');
                break;
            }
        }
    } else {
        console.error('Row not found');
    }
}
