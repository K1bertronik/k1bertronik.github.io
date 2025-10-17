document.getElementById('calcForm').addEventListener('submit', function (event) {
    event.preventDefault();

    var physicalDamage = parseFloat(document.getElementById('physdmg').value) || 0;
    var maxHealth = parseFloat(document.getElementById('maxHealth').value) || 0;
    var currentHealth = parseFloat(document.getElementById('currentHealth').value) || 0;

    var flashStrikeDamage = calculateDamage(FlashStrike(physicalDamage));
    var vortexBladeDamage = calculateDamage(VortexBlade(physicalDamage)[0]);
    var vortexBladeBoostedDamage = calculateDamage(VortexBlade(physicalDamage)[1]);
    var hamstringDamage = calculateDamage(Hamstring(physicalDamage), false);
    var magicTransformShield = MagicTransformation(physicalDamage, maxHealth, currentHealth);
    var sonicBoomDamage = calculateDamage(SonicBoom(physicalDamage), false, false);
    var counterattackDamage = calculateDamage(Counterattack(physicalDamage), true, false);
    var strikeHurricaneDamage = calculateDamage(StrikeHurricane(physicalDamage), true, false);
    var markOfBladeHeal = calculateHeal(MarkOfBlade(maxHealth));

    updateDamageValues(flashStrikeDamage, "flashStrikeRow");
    updateDamageValues(vortexBladeDamage, "vortexBladeRow");
    updateDamageValues(vortexBladeBoostedDamage, "vortexBladeBoostRow");
    updateDamageValues(hamstringDamage, "hamstringRow");
    updateDamageValues(magicTransformShield, "magicTransformRow");
    updateDamageValues(sonicBoomDamage, "sonicBoomRow");
    updateDamageValues(counterattackDamage, "counterattackRow");
    updateDamageValues(strikeHurricaneDamage, "strikeHurricaneRow");
    updateDamageValues(markOfBladeHeal, "markOfBladeRow");
});

function calculateDamage(skillDamageLevels, isInstantDamage=true, isBasicSkill=true) {
    var totalDamageLevels = [];

    var isPVPTarget = document.getElementById('pvpSwitch').checked;

    var penetration = (parseFloat(document.getElementById('penetration').value) || 0) / 100;
    var ferocity = (isPVPTarget ? (parseFloat(document.getElementById('ferocity').value) || 0) / 100 : 0);

    var targetPhysicalDefence = (parseFloat(document.getElementById('targetPhysicalDefencePercent').value) || 0) / 100;

    var targetResilience = (isPVPTarget ? (parseFloat(document.getElementById('targetResilience').value) || 0) / 100 : 0);

    var talentDmgBonus = (isInstantDamage ? (parseFloat(document.getElementById('instDmgBonus').value) || 0) / 100 : (parseFloat(document.getElementById('dotDmgBonus').value) || 0) / 100);

    var talentPVEDmgBonusI = (isPVPTarget ? 0 : (parseFloat(document.getElementById('pveBonusI').value) || 0) / 100);
    var talentPVEDmgBonusII = (isPVPTarget ? 0 : (parseFloat(document.getElementById('pveBonusII').value) || 0) / 100);

    var dotPenBonus = (isInstantDamage ? 0 : (parseFloat(document.getElementById('dotPenBonus').value) || 0) / 100);
    var instPenBonus = (!isInstantDamage ? 0 : (parseFloat(document.getElementById('instPenBonus').value) || 0) / 100);

    var castleDmg = (parseFloat(document.getElementById('castleDmg').value) || 0) / 100;
    var exclusiveAttackBonus = (isBasicSkill ? (document.getElementById('exclusiveAttackBonus').checked ? 0.10 : 0) : 0);

    var strikeOnslaughtBonus = (parseFloat(document.getElementById('strikeOnslaughtBonus').value) || 0) / 100;

    for (var level = 0; level < skillDamageLevels.length; level++) {
        var skillDamage = skillDamageLevels[level];
        var totalDamage = skillDamage * (1 - Math.max(0, targetPhysicalDefence - (penetration + dotPenBonus + instPenBonus))) * (1 + talentDmgBonus + talentPVEDmgBonusI + talentPVEDmgBonusII + strikeOnslaughtBonus) * (1 - targetResilience) * (1 + ferocity) * (1 + castleDmg + exclusiveAttackBonus);
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

function FlashStrike(physicalDamage){
    var damageLevels = [];

    var baseValues = [20, 40, 60, 80, 100];
    var percentageIncreases = [140.0, 145.0, 150.0, 155.0, 160.0];

    var relicBonus = document.getElementById('relicBonus').checked ? 0.12 : 0;
    var unitedBonus = (parseFloat(document.getElementById('unitedAttackBonus').value) || 0) / 100;

    var strikeBonus = (document.getElementById('strikeBonus').checked ? 0.08 : 0);

    for (var level = 0; level < 5; level++) {
        var damage = (baseValues[level] + physicalDamage * (percentageIncreases[level] / 100 + strikeBonus)) * (1 + relicBonus + unitedBonus);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function VortexBlade(physicalDamage){
    var damageLevels = [];
    var boostedDamageLevels = [];

    var percentageIncreases = [90.0, 95.0, 100.0, 110.0, 120.0];
    var percentageBoostIncreases = [15.0, 20.0, 25.0, 30.0, 40.0];

    var relicBonus = document.getElementById('relicBonus').checked ? 0.12 : 0;
    var vortexStrikeBonus = (parseFloat(document.getElementById('vortexStrikeBonus').value) || 0) / 100;

    for (var level = 0; level < 5; level++) {
        var damage = physicalDamage * (percentageIncreases[level] / 100 + vortexStrikeBonus) * (1 + relicBonus);
        var boostedDamage = damage * (1 + percentageBoostIncreases[level] / 100);

        damageLevels.push(damage);
        boostedDamageLevels.push(boostedDamage);
    }

    return [damageLevels, boostedDamageLevels];
}

function Hamstring(physicalDamage){
    var damageLevels = [];

    var percentageIncreases = [30.0, 35.0, 40.0, 45.0, 50.0];

    var relicBonus = document.getElementById('relicBonus').checked ? 0.12 : 0;
    var hamstringBonus = document.getElementById('hamstringBonus').checked ? 0.015 : 0;

    for (var level = 0; level < 5; level++) {
        var damage = physicalDamage * (percentageIncreases[level] / 100 + hamstringBonus) * (1 + relicBonus);

        damageLevels.push(damage);
    }

    return damageLevels;
}

function MagicTransformation(physicalDamage, maxHealth, currentHealth){
    var shieldLevels = [];

    var percentageIncreases = [80.0, 90.0, 105.0, 120.0];
    var percentageHealthIncreases = [0.5, 1, 1.5, 2];

    var magicTransformBonus = (parseFloat(document.getElementById('magicTransformBonus').value) || 0) / 100;
    var bastionBonus = document.getElementById('bastionBonus').checked ? 0.2 : 0;

    for (var level = 0; level < 4; level++) {
        var baseshield = physicalDamage * (percentageIncreases[level] / 100 + magicTransformBonus);
        var boostPerHealth = (((maxHealth - currentHealth) / maxHealth * 100) / 5) * (percentageHealthIncreases[level])

        var shield = baseshield * (1 + boostPerHealth / 100 + bastionBonus);
        shieldLevels.push(parseFloat(shield.toFixed(2)));
    }

    return shieldLevels;
}

function SonicBoom(physicalDamage){
    var damageLevels = [];

    var percentageIncreases = [35.0, 40.0, 45.0, 55.0];

    var sonicBoomBonus = (parseFloat(document.getElementById('sonicBoomBonus').value) || 0) / 100;

    for (var level = 0; level < 4; level++) {
        var damage = physicalDamage * (percentageIncreases[level] / 100 + sonicBoomBonus);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function Counterattack(physicalDamage){
    var damageLevels = [];

    var percentageIncreases = [25.0, 32.0, 40.0, 50.0];

    var counterattackBonus = document.getElementById('counterattackBonus').checked ? 0.02 : 0;
    var counterattackBonusI = (parseFloat(document.getElementById('counterattackBonusI').value) || 0) / 100;

    for (var level = 0; level < 4; level++) {
        var damage = physicalDamage * (percentageIncreases[level] / 100 + counterattackBonus + counterattackBonusI);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function StrikeHurricane(physicalDamage){
    var damageLevels = [];

    var countOfHits = [3, 3, 4, 5];
    var percentageIncreases = [40.0, 40.0, 45.0, 45.0];

    for (var level = 0; level < 4; level++) {
        var damage = countOfHits[level] * (physicalDamage * (percentageIncreases[level] / 100));
        damageLevels.push(damage);
    }

    return damageLevels;
}

function MarkOfBlade(health){
    var healLevels = [];

    var percentageIncreases = [2.0, 3.0, 4.0, 5.0];

    var markOfBladeBonus = document.getElementById('markOfBladeBonus').checked ? 0.005 : 0;

    for (var level = 0; level < 4; level++) {
        var heal = health * (percentageIncreases[level] / 100 + markOfBladeBonus);
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
