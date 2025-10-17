document.getElementById('calcForm').addEventListener('submit', function (event) {
    event.preventDefault();

    var physicalDamage = parseFloat(document.getElementById('physdmg').value) || 0;
    var health = parseFloat(document.getElementById('health').value) || 0;

    var powerfulShotDamage = calculateDamage(PowerfulShot(physicalDamage),true, false, true);
    var blessingDamage = calculateDamage(RangersBlessing(physicalDamage),true, false, true);
    var fireArrowsDamage = calculateDamage(FireArrows(physicalDamage));
    var fireArrowsDotDamage = calculateDamage(FireArrows(physicalDamage, true), false);
    var explosiveTrapDamage = calculateDamage(ExplosiveTrap(physicalDamage));
    var explosiveTrapDamage = calculateDamage(ExplosiveTrap(physicalDamage));
    var hailOfArrowsDamage = calculateDamage(HailOfArrows(physicalDamage));
    var hailOfArrowsMassDamage = HailOfArrowsMass(hailOfArrowsDamage);
    var bowStrikeDamage = calculateDamage(BowStrike(physicalDamage));
    var vengefulShotDamage = calculateDamage(VengefulShot(physicalDamage));
    var vengefulShotDotDamage = calculateDamage(VengefulShotDot(physicalDamage), false);
    var increasedDangerDamage = calculateDamage(IncreasedDanger(physicalDamage), false, true);

    updateDamageValues(powerfulShotDamage, "powerfulShotRow");
    updateDamageValues(blessingDamage, "blessingRow");
    updateDamageValues(fireArrowsDamage, "fireArrowsRow");
    updateDamageValues(fireArrowsDotDamage, "fireArrowsDotRow");
    updateDamageValues(explosiveTrapDamage, "explosiveTrapRow");
    updateDamageValues(hailOfArrowsDamage, "hailOfArrowsRow");
    updateDamageValues(hailOfArrowsMassDamage, "hailOfArrowsMassRow");
    updateDamageValues(bowStrikeDamage, "bowStrikeRow");
    updateDamageValues(vengefulShotDamage, "vengefulShotRow");
    updateDamageValues(vengefulShotDotDamage, "vengefulShotDotRow");
    updateDamageValues(increasedDangerDamage, "increasedDangerRow");
});

function calculateDamage(skillDamageLevels, isInstantDamage=true, isTalent=false, isBasicSkill=false) {
    var totalDamageLevels = [];

    var isPVPTarget = document.getElementById('pvpSwitch').checked;

    var penetration = (parseFloat(document.getElementById('penetration').value) || 0) / 100;
    var ferocity = (isPVPTarget ? (parseFloat(document.getElementById('ferocity').value) || 0) / 100 : 0);

    var targetPhysicalDefence = (parseFloat(document.getElementById('targetPhysicalDefencePercent').value) || 0) / 100;

    var targetResilience = (isPVPTarget ? (parseFloat(document.getElementById('targetResilience').value) || 0) / 100 : 0);

    var talentDmgBonus = (isInstantDamage ? (parseFloat(document.getElementById('instDmgBonus').value) || 0) / 100 : (parseFloat(document.getElementById('dotDmgBonus').value) || 0) / 100);

    var talentPVEDmgBonusI = (isPVPTarget || isTalent ? 0 : (parseFloat(document.getElementById('pveBonusI').value) || 0) / 100);
    var talentPVEDmgBonusII = (isPVPTarget ? 0 : (parseFloat(document.getElementById('pveBonusII').value) || 0) / 100);

    var dotPenBonus = (isInstantDamage ? 0 : (parseFloat(document.getElementById('dotPenBonus').value) || 0) / 100);
    var instPenBonus = (!isInstantDamage ? 0 : (parseFloat(document.getElementById('instPenBonus').value) || 0) / 100);

    var castleDmg = (parseFloat(document.getElementById('castleDmg').value) || 0) / 100;
    var exclusiveAttackBonus = (isBasicSkill ? (document.getElementById('exclusiveAttackBonus').checked ? 0.10 : 0) : 0);

    var isHeavyArtillery = document.getElementById('isHeavyArtillery').checked;
    var attackSpeed = (parseFloat(document.getElementById('attackSpeed').value) || 0) / 100;

    for (var level = 0; level < skillDamageLevels.length; level++) {
        var skillDamage = skillDamageLevels[level];
        var totalDamage = skillDamage * (1 - Math.max(0, targetPhysicalDefence - (penetration + dotPenBonus + instPenBonus))) * (1 + talentDmgBonus + talentPVEDmgBonusI + talentPVEDmgBonusII + (isHeavyArtillery ? (2 * (attackSpeed / 3)) : 0)) * (1 - targetResilience) * (1 + ferocity) * (1 + castleDmg + exclusiveAttackBonus);
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

function PowerfulShot(physicalDamage){
    var damageLevels = [];

    var baseValues = [20, 40, 60, 80, 100];
    var percentageIncreases = [100.0, 103.0, 106.0, 109.0, 112.0];

    var relicBonus = document.getElementById('relicBonus').checked ? 0.12 : 0;
    var unitedBonus = (parseFloat(document.getElementById('unitedAttackBonus').value) || 0) / 100;

    var powerfulShotBonus = (parseFloat(document.getElementById('powerfulShotBonus').value) || 0) / 100;

    var isBullseye = document.getElementById('isBullseye').checked;
    var maxHealth = (parseFloat(document.getElementById('targetMaxHealth').value) || 0) / 100;
    var currentHealth = (parseFloat(document.getElementById('targetCurrentHealth').value) || 0) / 100;

    for (var level = 0; level < 5; level++) {
        var damage = (baseValues[level] + physicalDamage * (percentageIncreases[level] / 100 + powerfulShotBonus)) * (1 + relicBonus + unitedBonus) * (isBullseye ? (1 + ((currentHealth / maxHealth) * 10) * 0.03) : 1);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function RangersBlessing(physicalDamage){
    var damageLevels = [];

    var percentageIncreases = [15.0, 20.0, 25.0, 30.0, 40.0];

    var blessingBonus = (parseFloat(document.getElementById('blessingBonus').value) || 0) / 100;

    var isflexibleBowstring = document.getElementById('isflexibleBowstring').checked;
    var attackStrength = (parseFloat(document.getElementById('attackStrength').value) || 0) / 100;

    for (var level = 0; level < 5; level++) {
        var damage = physicalDamage * (percentageIncreases[level] / 100 + blessingBonus) * (isflexibleBowstring ? 0.3 : 1) * (isflexibleBowstring ? (1 + attackStrength) : 1);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function FireArrows(physicalDamage, isDot=false){
    var damageLevels = [];

    var percentageIncreases = [55.0, 60.0, 65.0, 70.0];

    var fireArrowsDotBonus = (parseFloat(document.getElementById('fireArrowsDotBonus').value) || 0) / 100;

    for (var level = 0; level < 4; level++) {
        var damage = physicalDamage * (percentageIncreases[level] / 100 + (isDot ? fireArrowsDotBonus : 0));
        damageLevels.push(damage);
    }

    return damageLevels;
}

function ExplosiveTrap(physicalDamage){
    var damageLevels = [];

    var percentageIncreases = [100.0, 105.0, 115.0, 125.0];

    for (var level = 0; level < 4; level++) {
        var damage = physicalDamage * (percentageIncreases[level] / 100);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function HailOfArrows(physicalDamage){
    var damageLevels = [];

    var percentageIncreases = [110.0, 120.0, 135.0, 150.0];

    var hailOfArrowsBonus = document.getElementById('hailOfArrowsBonus').checked ? 0.075 : 0;

    var isFireVoley = document.getElementById('isFireVoley').checked;
    var distance = (parseFloat(document.getElementById('rangeOfHail').value) || 0);

    for (var level = 0; level < 4; level++) {
        var damage = physicalDamage * (percentageIncreases[level] / 100 + hailOfArrowsBonus) * (1 + (isFireVoley ? (0.1 * distance) : 0));
        damageLevels.push(damage);
    }

    return damageLevels;
}

function HailOfArrowsMass(skillLevels){
    var damageLevels = [];

    var percentageIncreases = [45.0, 50.0, 60.0, 70.0];

    for (var level = 0; level < 4; level++) {
        var damage = skillLevels[level] * (percentageIncreases[level] / 100);
        damageLevels.push(parseFloat(damage.toFixed(2)));
    }

    return damageLevels;
}

function BowStrike(physicalDamage){
    var damageLevels = [];

    var percentageIncreases = [80.0, 90.0, 105.0, 120.0];

    for (var level = 0; level < 4; level++) {
        var damage = physicalDamage * (percentageIncreases[level] / 100);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function VengefulShot(physicalDamage){
    var damageLevels = [];

    var percentageIncreases = [70.0, 80.0, 90.0, 100.0];

    for (var level = 0; level < 4; level++) {
        var damage = physicalDamage * (percentageIncreases[level] / 100);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function VengefulShotDot(physicalDamage){
    var damageLevels = [];

    var percentageIncreases = [20.0, 30.0, 40.0, 50.0];

    var vengefulshotBonus = (parseFloat(document.getElementById('vengefulshotBonus').value) || 0) / 100;

    for (var level = 0; level < 4; level++) {
        var damage = physicalDamage * (percentageIncreases[level] / 100 + vengefulshotBonus);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function IncreasedDanger(physicalDamage){
    var damageLevels = [];

    var percentageIncrease = 0.25;

    var damage = physicalDamage * percentageIncrease;
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
