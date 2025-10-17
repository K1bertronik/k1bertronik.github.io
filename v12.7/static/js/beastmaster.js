document.getElementById('calcForm').addEventListener('submit', function (event) {
    event.preventDefault();

    var physicalDamage = parseFloat(document.getElementById('physdmg').value) || 0;
    var magicalDamage = parseFloat(document.getElementById('magicdmg').value) || 0;
    var health = parseFloat(document.getElementById('health').value) || 0;

    var beastLevel = (parseFloat(document.getElementById('beastLevel').value) || 0) - 1;

    var moonHealth = BeastAwakening(physicalDamage, magicalDamage, health)[0];
    var moonDamage = calculateDamage(BeastAwakening(physicalDamage, magicalDamage, health)[1], 'physical');

    var moonTouchDamage = calculateDamage(MoonTouch(magicalDamage), 'magical');
    var healingMoonHP = calculateHeal(HealingHP(moonHealth[beastLevel], health)[0]);
    var healingHP = calculateHeal(HealingHP(moonHealth[beastLevel], health)[1]);
    var healing = calculateHeal(Healing(magicalDamage));
    var chainLightning = calculateDamage(ChainLightning(physicalDamage, magicalDamage), (physicalDamage > magicalDamage) ? 'physical' : 'magical');
    var bestialRampageHeal = calculateHeal(BestialRampage());
    var soulConnectionHeal = calculateHeal(SoulConnection(moonHealth[beastLevel]));
    var moonlightDamage = calculateDamage(Moonlight(magicalDamage), 'magical', false, false, false);
    var auraOfForestDamage = calculateDamage(AuraOfForest(magicalDamage), 'magical', false, false, false);
    var proximityToNatureHeal = calculateHeal(ProximityToNature(magicalDamage));

    updateDamageValues(moonHealth, "beastAwakeHealthRow");
    updateDamageValues(moonDamage, "beastAwakeDamageRow");
    updateDamageValues(moonTouchDamage, "moonTouchRow");
    updateDamageValues(healingMoonHP, "healingHealthMoonRow");
    updateDamageValues(healingHP, "healingHealthRow");
    updateDamageValues(healing, "healingRow");
    updateDamageValues(chainLightning, "chainLightningRow");
    updateDamageValues(bestialRampageHeal, "bestialRampageRow");
    updateDamageValues(soulConnectionHeal, "soulConnectionRow");
    updateDamageValues(moonlightDamage, "moonlightRow");
    updateDamageValues(auraOfForestDamage, "auraOfForestRow");
    updateDamageValues(proximityToNatureHeal, "proximityToNatureRow");
});

function calculateDamage(skillDamageLevels, damageType, isInstantDamage=true, isTalent=false, isBasicSkill=true) {
    var totalDamageLevels = [];

    var isPVPTarget = document.getElementById('pvpSwitch').checked;

    var penetration = (parseFloat(document.getElementById('penetration').value) || 0) / 100;
    var ferocity = (isPVPTarget ? (parseFloat(document.getElementById('ferocity').value) || 0) / 100 : 0);

    var targetPhysicalDefence = (parseFloat(document.getElementById('targetPhysicalDefencePercent').value) || 0) / 100;

    var targetMagicalDefence = (parseFloat(document.getElementById('targetMagicalDefencePercent').value) || 0) / 100;

    var targetResilience = (isPVPTarget ? (parseFloat(document.getElementById('targetResilience').value) || 0) / 100 : 0);

    var talentDmgBonus = (isInstantDamage ? (parseFloat(document.getElementById('instDmgBonus').value) || 0) / 100 : (parseFloat(document.getElementById('dotDmgBonus').value) || 0) / 100);

    var talentPVEDmgBonusI = (isPVPTarget || isTalent ? 0 : (parseFloat(document.getElementById('pveBonusI').value) || 0) / 100);
    var talentPVEDmgBonusII = (isPVPTarget ? 0 : (parseFloat(document.getElementById('pveBonusII').value) || 0) / 100);

    var dotPenBonus = (isInstantDamage ? 0 : (parseFloat(document.getElementById('dotPenBonus').value) || 0) / 100);
    var instPenBonus = (!isInstantDamage ? 0 : (parseFloat(document.getElementById('instPenBonus').value) || 0) / 100);

    var castleDmg = (parseFloat(document.getElementById('castleDmg').value) || 0) / 100;
    var exclusiveAttackBonus = (isBasicSkill ? (document.getElementById('exclusiveAttackBonus').checked ? 0.10 : 0) : 0);

    for (var level = 0; level < skillDamageLevels.length; level++) {
        var skillDamage = skillDamageLevels[level];
        var totalDamage = skillDamage * (1 - Math.max(0, (damageType === 'physical' ? targetPhysicalDefence : targetMagicalDefence) - (penetration + dotPenBonus + instPenBonus))) * (1 + talentDmgBonus + talentPVEDmgBonusI + talentPVEDmgBonusII) * (1 - targetResilience) * (1 + ferocity) * (1 + castleDmg + exclusiveAttackBonus);

        totalDamage = parseFloat(totalDamage.toFixed(2));

        totalDamageLevels.push(totalDamage);
    }

    return totalDamageLevels;
}

function calculateHeal(skillHealLevels) {
    var totalHealLevels = [];

    var castleHealBonus = (parseFloat(document.getElementById('castleHeal').value) || 0) / 100;
    var healPotBonus = (parseFloat(document.getElementById('healPot').value) || 0) / 100;
    var artOfHealingBonus = (parseFloat(document.getElementById('artOfHealingBonus').value) || 0) / 100;

    for (var level = 0; level < skillHealLevels.length; level++) {
        var skillHeal = skillHealLevels[level];
        var totalHeal = skillHeal * (1 + castleHealBonus + healPotBonus + artOfHealingBonus);
        totalHeal = parseFloat(totalHeal.toFixed(2));

        totalHealLevels.push(totalHeal);
    }

    return totalHealLevels;
}

function BeastAwakening(physicalDamage, magicalDamage, health){
    var healthLevels = [];
    var damageLevels = [];

    var percentageHealthIncreases = [90.0, 100.0, 110.0, 120.0, 130.0];
    var percentagePhysIncreases = [90.0, 100.0, 110.0, 120.0, 130.0];
    var percentageMagIncreases = [35.0, 45.0, 55.0, 65.0, 75.0];

    var beastBonusII = (parseFloat(document.getElementById('beastBonusII').value) || 0) / 100;
    var beastBonusIII = document.getElementById('beastBonusIII').checked ? 0.03 : 0;

    var moonTouchBoost = ((parseFloat(document.getElementById('moonTouchBoost').value) || 0) + (parseFloat(document.getElementById('moonTouchBonusAlm').value) || 0)) / 100;
    var orderToAttackBonus = ((parseFloat(document.getElementById('orderToAttackBonus').value) || 0) / 100) + ((parseFloat(document.getElementById('orderBonus').value) || 0) / 100);

    for (var level = 0; level < 5; level++) {
        var moonHealth = health * (percentageHealthIncreases[level] / 100);
        var damage = (physicalDamage * (percentagePhysIncreases[level] / 100 + beastBonusII) + magicalDamage * (percentageMagIncreases[level] / 100 + beastBonusIII)) * (1 + orderToAttackBonus) * (1 + moonTouchBoost);

        moonHealth = parseFloat(moonHealth.toFixed(2));

        healthLevels.push(moonHealth);
        damageLevels.push(damage);
    }

    return [healthLevels, damageLevels];
}

function MoonTouch(magicalDamage){
    var damageLevels = [];

    var baseValues = [40, 55, 70, 100, 120];
    var percentageIncreases = [130.0, 140.0, 155.0, 165.0, 175.0];

    var relicBonus = document.getElementById('relicBonus').checked ? 0.12 : 0;
    var unitedBonus = (parseFloat(document.getElementById('unitedAttackBonus').value) || 0) / 100;

    var moonTouchBonus = document.getElementById('moonTouchBonus').checked ? 0.05 : 0;

    for (var level = 0; level < 5; level++) {
        damage = baseValues[level] + magicalDamage * (percentageIncreases[level] / 100 + moonTouchBonus) * (1 + relicBonus + unitedBonus);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function HealingHP(moonHealth, health){
    var moonHealLevels = [];
    var healLevels = [];

    var percentageIncreases = [5.0, 8.0, 10.0, 12.0, 15.0];

    for (var level = 0; level < 5; level++) {
        var moonHeal = moonHealth * (percentageIncreases[level] / 100);
        var heal = health * (percentageIncreases[level] / 100);

        moonHealLevels.push(moonHeal);
        healLevels.push(heal);
    }

    return [moonHealLevels, healLevels];
}

function Healing(magicalDamage){
    var healLevels = [];

    var percentageIncreases = [15.0, 22.0, 30.0, 40.0, 50.0];

    var healingBonusI = document.getElementById('healingBonusI').checked ? 0.03 : 0;
    var healingBonusIII = (parseFloat(document.getElementById('healingBonusIII').value) || 0) / 100;

    for (var level = 0; level < 5; level++) {
        var heal = magicalDamage * (percentageIncreases[level] / 100 + healingBonusI + healingBonusIII);
        healLevels.push(heal);
    }

    return healLevels;
}

function ChainLightning(physicalDamage, magicalDamage){
    var damageLevels = [];

    var percentagePhysIncreases = [55.0, 65.0, 75.0, 85.0, 95.0];
    var percentageMagIncreases = [100.0, 115.0, 130.0, 145.0, 160.0];

    var relicBonus = document.getElementById('relicBonus').checked ? 0.12 : 0;

    var chainLightningBonus = document.getElementById('chainLightningBonusAlm').value;

    chainLightningBonus = chainLightningBonus.split(',');

    var physChainLightningBonus = parseFloat(chainLightningBonus[0]);
    var magChainLightningBonus = parseFloat(chainLightningBonus[1]);

    for (var level = 0; level < 5; level++) {
        if (physicalDamage > magicalDamage) {
            var damage = physicalDamage * ((percentagePhysIncreases[level] + physChainLightningBonus) / 100) * (1 + relicBonus);
        } else {
            var damage = magicalDamage * ((percentageMagIncreases[level] + magChainLightningBonus) / 100) * (1 + relicBonus);
        }
        damageLevels.push(damage);
    }

    return damageLevels;
}

function BestialRampage(){
    var healLevels = [];

    var bestialRampageDamage = parseFloat(document.getElementById('bestialRampageDamage').value) || 0;

    var percentageIncreases = [10.0, 15.0, 20.0, 25.0];

    var isSabertooth = document.getElementById('isSabertooth').checked;

    for (var level = 0; level < 4; level++) {
        var heal = bestialRampageDamage * (percentageIncreases[level] / 100) * (isSabertooth ? 0.4 : 1);
        healLevels.push(heal);
    }

    return healLevels;
}

function SoulConnection(moonHealth){
    var healLevels = [];

    var percentageIncreases = [0.9, 1.2, 1.8, 2.5];

    var SoulConnectionBonus = parseFloat(document.getElementById('soulConnectionBonusAlm').value) || 0;

    for (var level = 0; level < 4; level++) {
        var heal = moonHealth * ((percentageIncreases[level] + SoulConnectionBonus) / 100);
        healLevels.push(heal);
    }

    return healLevels;
}

function Moonlight(magicalDamage){
    var damageLevels = [];

    var percentageIncreases = [20.0, 25.0, 30.0, 40.0];

    var moonlightBonus = (parseFloat(document.getElementById('moonlightBonus').value) || 0) / 100;

    for (var level = 0; level < 4; level++) {
        damage = magicalDamage * (percentageIncreases[level] / 100 + moonlightBonus);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function AuraOfForest(magicalDamage){
    var damageLevels = [];

    var percentageIncreases = [35.0, 45.0, 60.0, 80.0];

    var auraOfForestBoost = (parseFloat(document.getElementById('auraOfForestBoost').value) || 0) / 100;
    var powerOfNature = document.getElementById('powerOfNatureBonus').checked
    var powerOfNatureBonus = powerOfNature ? 0.15 : 0;
    var grandeurBonus = document.getElementById('grandeurBonus').checked ? 0.2 : 0;

    for (var level = 0; level < 4; level++) {
        damage = magicalDamage * (percentageIncreases[level] / 100) * (1 + (powerOfNature ? 0.2 : auraOfForestBoost)) * (1 + powerOfNatureBonus - grandeurBonus);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function ProximityToNature(magicalDamage){
    var healLevels = [];

    var percentageIncreases = [25.0, 30.0, 35.0, 40.0];

    var proximityBonus = (parseFloat(document.getElementById('proximityBonus').value) || 0) / 100;
    var proximityBonusIII = document.getElementById('proximityBonusIII').checked ? 0.02 : 0;

    for (var level = 0; level < 4; level++) {
        var heal = magicalDamage * (percentageIncreases[level] / 100 + proximityBonus + proximityBonusIII);
        healLevels.push(heal);
    }

    return healLevels;
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
