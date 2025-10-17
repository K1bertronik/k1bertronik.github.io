document.getElementById('calcForm').addEventListener('submit', function (event) {
    event.preventDefault();

    var physicalDamage = parseFloat(document.getElementById('physdmg').value) || 0;
    var health = parseFloat(document.getElementById('health').value) || 0;

    var splittingDamage = calculateDamage(Splitting(physicalDamage), true, true);
    var haradShield = HaradShield(health);
    var dangerousBlowDamage = calculateDamage(DangerousBlow(physicalDamage));
    var dangerousBlowDotDamage = calculateDamage(DangerousBlowDot(physicalDamage));
    var dangerousBlowDotCritDamage = calculateDamage(DangerousBlowDot(physicalDamage, true));
    var splittingBlowDamage = calculateDamage(SplittingBlow(physicalDamage));
    var bloodthirstDamage = calculateDamage(Bloodthirst(physicalDamage));
    var bloodthirstHeal = calculateHeal(BloodthirstHeal(health));
    var exhaustiveBlowDamage = calculateDamage(ExhaustiveBlow(physicalDamage));
    var scarletBladeDamage = calculateDamage(ScarletBlade(physicalDamage));
    var autoattackDamage = Autoattack(physicalDamage);

    updateDamageValues(splittingDamage, "splittingRow");
    updateDamageValues(haradShield, "haradShieldRow");
    updateDamageValues(dangerousBlowDamage, "dangerousBlowRow");
    updateDamageValues(dangerousBlowDotDamage, "dangerousBlowDotRow");
    updateDamageValues(dangerousBlowDotCritDamage, "dangerousBlowDotCritRow");
    updateDamageValues(splittingBlowDamage, "splittingBlowRow");
    updateDamageValues(bloodthirstDamage, "bloodthirstRow");
    updateDamageValues(bloodthirstHeal, "bloodthirstHealRow");
    updateDamageValues(exhaustiveBlowDamage, "exhaustiveBlowRow");
    updateDamageValues(scarletBladeDamage, "scarletBladeRow");
    updateDamageValues(autoattackDamage, "autoattackRow");
});

function calculateDamage(skillDamageLevels, isInstantDamage=true, isBasicSkill=false) {
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

    var attractionBonus = (parseFloat(document.getElementById('attractionBonus').value) || 0) / 100;

    for (var level = 0; level < skillDamageLevels.length; level++) {
        var skillDamage = skillDamageLevels[level];
        var totalDamage = skillDamage * (1 - Math.max(0, targetPhysicalDefence - (penetration + dotPenBonus + instPenBonus))) * (1 + talentDmgBonus + talentPVEDmgBonusI + talentPVEDmgBonusII) * (1 - targetResilience) * (1 + ferocity) * (1 + castleDmg + exclusiveAttackBonus) * (1 + attractionBonus);
        totalDamage = parseFloat(totalDamage.toFixed(2));

        totalDamageLevels.push(totalDamage);
    }

    return totalDamageLevels;
}

function calculateHeal(skillHealLevels) {
    var totalHealLevels = [];

    var castleHealBonus = (parseFloat(document.getElementById('castleHeal').value) || 0) / 100;
    var healPotBonus = (parseFloat(document.getElementById('healPot').value) || 0) / 100;

    var stupefyingPainBonus = document.getElementById('stupefyingPainBonus').checked ? 0.5 : 0;

    for (var level = 0; level < skillHealLevels.length; level++) {
        var skillHeal = skillHealLevels[level];
        var totalHeal = skillHeal * (1 - stupefyingPainBonus + castleHealBonus + healPotBonus);
        totalHeal = parseFloat(totalHeal.toFixed(2));

        totalHealLevels.push(totalHeal);
    }

    return totalHealLevels;
}

function Splitting(physicalDamage){
    var damageLevels = [];

    var baseValues = [20, 40, 60, 80, 100];
    var percentageIncreases = [140.0, 145.0, 150.0, 155.0, 160.0];

    var relicBonus = document.getElementById('relicBonus').checked ? 0.12 : 0;
    var unitedBonus = (parseFloat(document.getElementById('unitedAttackBonus').value) || 0) / 100;

    var splittingBonus = (parseFloat(document.getElementById('splittingBonus').value) || 0) / 100;

    for (var level = 0; level < 5; level++) {
        var damage = (baseValues[level] + physicalDamage * (percentageIncreases[level] / 100 + splittingBonus)) * (1 + relicBonus + unitedBonus);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function HaradShield(health){
    var shieldLevels = [];

    var baseValues = [50, 80, 120, 150, 200];
    var percentageIncreases = [8.0, 10.0, 12.0, 16.0, 20.0];

    for (var level = 0; level < 5; level++) {
        var shield = (baseValues[level] + health * (percentageIncreases[level] / 100));
        shield = parseFloat(shield.toFixed(2));

        shieldLevels.push(shield);
    }

    return shieldLevels;
}

function DangerousBlow(physicalDamage){
    var damageLevels = [];

    var percentageIncreases = [110.0, 115.0, 120.0, 130.0];

    for (var level = 0; level < 4; level++) {
        var damage = physicalDamage * (percentageIncreases[level] / 100);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function DangerousBlowDot(physicalDamage, isCrit=false){
    var damageLevels = [];

    var percentageIncreases = [45.0, 50.0, 60.0, 70.0];
    var percentageCritIncreases = [10.0, 13.0, 16.0, 20.0];

    var dangerousBlowBonus = (parseFloat(document.getElementById('dangerousBlowBonus').value) || 0) / 100;

    for (var level = 0; level < 4; level++) {
        var damage = physicalDamage * (percentageIncreases[level] / 100 + dangerousBlowBonus) * (1 + (isCrit ? (percentageCritIncreases[level] / 100) : 0));
        damageLevels.push(damage);
    }

    return damageLevels;
}

function SplittingBlow(physicalDamage){
    var damageLevels = [];

    var percentageIncreases = [30.0, 35.0, 40.0, 50.0];

    var splittingBlowBonus = (parseFloat(document.getElementById('splittingBlowBonus').value) || 0) / 100;
    var splittingBlowBonusII = (parseFloat(document.getElementById('splittingBlowBonusII').value) || 0) / 100;

    for (var level = 0; level < 4; level++) {
        var damage = physicalDamage * (percentageIncreases[level] / 100 + splittingBlowBonus + splittingBlowBonusII);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function Bloodthirst(physicalDamage){
    var damageLevels = [];

    var percentageIncreases = [135.0, 145.0, 160.0, 180.0];

    var bloodthirstBonus = document.getElementById('bloodthirstBonus').checked ? 0.09 : 0;

    var isBloodyRampage = document.getElementById('isBloodyRampage').checked;

    var bleedingCount = parseFloat(document.getElementById('bleedingCount').value) || 0;

    for (var level = 0; level < 4; level++) {
        var damage = physicalDamage * (percentageIncreases[level] / 100 + bloodthirstBonus) * (1 + (isBloodyRampage ? (bleedingCount * 0.05) : 0));
        damageLevels.push(damage);
    }

    return damageLevels;
}

function BloodthirstHeal(health){
    var healLevels = [];

    var percentageIncreases = [2.0, 2.5, 3.5, 4.0];

    var bleedingCount = parseFloat(document.getElementById('bleedingCount').value) || 0;

    for (var level = 0; level < 4; level++) {
        var heal = health * (percentageIncreases[level] / 100 * bleedingCount);
        healLevels.push(heal);
    }

    return healLevels;
}

function ExhaustiveBlow(physicalDamage){
    var damageLevels = [];

    var percentageIncreases = [110.0, 115.0, 120.0, 125.0];

    for (var level = 0; level < 4; level++) {
        var damage = physicalDamage * (percentageIncreases[level] / 100);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function ScarletBlade(physicalDamage){
    var damageLevels = [];

    var percentageIncrease = 0.25;

    var damage = physicalDamage * percentageIncrease;
    damageLevels.push(damage);

    return damageLevels;
}

function Autoattack(physicalDamage){
    var totalDamage = [];

    var attackStrength = (parseFloat(document.getElementById('attackStrength').value) || 0) / 100;

    var isPVPTarget = document.getElementById('pvpSwitch').checked;

    var penetration = (parseFloat(document.getElementById('penetration').value) || 0) / 100;
    var ferocity = (isPVPTarget ? (parseFloat(document.getElementById('ferocity').value) || 0) / 100 : 0);

    var targetPhysicalDefence = parseFloat(document.getElementById('targetPhysicalDefence').value) || 0;
    targetPhysicalDefence = targetPhysicalDefence / (targetPhysicalDefence + 6500);

    var targetResilience = (isPVPTarget ? (parseFloat(document.getElementById('targetResilience').value) || 0) / 100 : 0);

    var talentPVEDmgBonusII = (isPVPTarget ? 0 : (parseFloat(document.getElementById('pveBonusII').value) || 0) / 100);

    var attractionBonus = (parseFloat(document.getElementById('attractionBonus').value) || 0) / 100;

    var isSteelSlicer = document.getElementById('isSteelSlicer').checked;

    var battlePotentialBonus = document.getElementById('battlePotentialBonus').checked ? 2 : 1;

    var damage = (physicalDamage * (1 + attackStrength)) * (1 - (isSteelSlicer ? 0 : Math.max(0, targetPhysicalDefence - penetration))) * (1 + attractionBonus + (isSteelSlicer ? 0.15 : 0)) * (1 + talentPVEDmgBonusII) * (1 - targetResilience) * (1 + ferocity);

    damage = damage * battlePotentialBonus;

    damage = parseFloat(damage.toFixed(2));

    totalDamage.push(damage);

    return totalDamage;
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
