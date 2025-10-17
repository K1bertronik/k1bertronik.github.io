document.getElementById('calcForm').addEventListener('submit', function (event) {
    event.preventDefault();

    var magicalDamage = parseFloat(document.getElementById('magicdmg').value) || 0;
    var health = parseFloat(document.getElementById('health').value) || 0;

    var lightningBallDamage = calculateDamage(LightningBall(magicalDamage), false, true);
    var healingSpiritHeal = calculateHeal(HealingSpirit(magicalDamage));
    var earthquakeDamage = calculateDamage(Earthquake(magicalDamage), false, true);
    var lightningShieldDamage = calculateDamage(LightningShield(magicalDamage));
    var fireTotemDamage = calculateDamage(FireTotem(magicalDamage));
    var fireTotemTickDamage = calculateDamage(FireTotemTick(magicalDamage));
    var ancestorsHandShield = AncestorsHand(magicalDamage);
    var healingTotemHeal = calculateHeal(HealingTotem(magicalDamage, health));
    var electrificationDamage = calculateDamage(Electrification(magicalDamage), true);
    var ancestralCharmHeal = calculateHeal(AnsestralCharm(magicalDamage));

    updateDamageValues(lightningBallDamage, "lightningBallRow");
    updateDamageValues(healingSpiritHeal, "healingSpiritRow");
    updateDamageValues(earthquakeDamage, "earthquakeRow");
    updateDamageValues(lightningShieldDamage, "lightningShieldRow");
    updateDamageValues(fireTotemDamage, "fireTotemRow");
    updateDamageValues(fireTotemTickDamage, "fireTotemTickRow");
    updateDamageValues(ancestorsHandShield, "ancestorsHandRow");
    updateDamageValues(healingTotemHeal, "healTotemRow");
    updateDamageValues(electrificationDamage, "elictrificationRow");
    updateDamageValues(ancestralCharmHeal, "ancestralCharmRow");
});

function calculateDamage(skillDamageLevels, isTalent=false, isBasicSkill=false) {
    var totalDamageLevels = [];

    var isPVPTarget = document.getElementById('pvpSwitch').checked;

    var penetration = (parseFloat(document.getElementById('penetration').value) || 0) / 100;
    var ferocity = (isPVPTarget ? (parseFloat(document.getElementById('ferocity').value) || 0) / 100 : 0);

    var targetMagicalDefence = parseFloat(document.getElementById('targetMagicalDefence').value) || 0;
    targetMagicalDefence = targetMagicalDefence / (targetMagicalDefence + 6500);
    var targetMagicalReduction = (penetration > targetMagicalDefence) ? 0 : targetMagicalDefence - penetration;
    var targetResilience = (isPVPTarget ? (parseFloat(document.getElementById('targetResilience').value) || 0) / 100 : 0);

    var talentPVEDmgBonusI = (isPVPTarget || isTalent ? 0 : (parseFloat(document.getElementById('pveBonusI').value) || 0) / 100);
    var talentPVEDmgBonusII = (isPVPTarget ? 0 : (parseFloat(document.getElementById('pveBonusII').value) || 0) / 100);

    var castleDmg = (isTalent ? 0 : (parseFloat(document.getElementById('castleDmg').value) || 0) / 100);
    var exclusiveAttackBonus = (isBasicSkill ? (document.getElementById('exclusiveAttackBonus').checked ? 0.10 : 0) : 0);

    for (var level = 0; level < skillDamageLevels.length; level++) {
        var skillDamage = skillDamageLevels[level];
        var totalDamage = skillDamage * (1 - targetMagicalReduction) * (1 + talentPVEDmgBonusI + talentPVEDmgBonusII) * (1 - targetResilience) * (1 + ferocity) * (1 + castleDmg + exclusiveAttackBonus);
        totalDamage = parseFloat(totalDamage.toFixed(2));

        totalDamageLevels.push(totalDamage);
    }

    return totalDamageLevels;
}

function calculateHeal(skillHealLevels) {
    var totalHealLevels = [];

    var castleHealBonus = (parseFloat(document.getElementById('castleHeal').value) || 0) / 100;
    var healPotBonus = (parseFloat(document.getElementById('healPot').value) || 0) / 100;
    var healBonus = (parseFloat(document.getElementById('healBonus').value) || 0) / 100;
    var healingRiteBonus = (parseFloat(document.getElementById('healingRiteBonus').value) || 0) / 100;

    for (var level = 0; level < skillHealLevels.length; level++) {
        var skillHeal = skillHealLevels[level];
        var totalHeal = skillHeal * (1 + castleHealBonus + healPotBonus + healBonus + healingRiteBonus);
        totalHeal = parseFloat(totalHeal.toFixed(2));

        totalHealLevels.push(totalHeal);
    }

    return totalHealLevels;
}

function LightningBall(magicalDamage){
    var damageLevels = [];

    var baseValues = [30, 55, 80, 105, 130];
    var percentageIncreases = [110.0, 115.0, 120.0, 125.0, 130.0];

    var relicBonus = document.getElementById('relicBonus').checked ? 0.12 : 0;
    var unitedBonus = (parseFloat(document.getElementById('unitedAttackBonus').value) || 0) / 100;

    var lightningBallBonus = (parseFloat(document.getElementById('lightningBallBonus').value) || 0) / 100;

    for (var level = 0; level < 5; level++) {
        var damage = (baseValues[level] + magicalDamage * (percentageIncreases[level] / 100 + lightningBallBonus)) * (1 + relicBonus + unitedBonus);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function HealingSpirit(magicalDamage){
    var healLevels = [];

    var baseValues = [6, 11, 16, 21, 26];
    var percentageIncreases = [30.0, 35.0, 40.0, 45.0, 55.0];

    var healingSpiritBonus = (parseFloat(document.getElementById('healingSpiritBonus').value) || 0) / 100;

    for (var level = 0; level < 5; level++) {
        var heal = (baseValues[level] + magicalDamage * (percentageIncreases[level] / 100 + healingSpiritBonus));
        healLevels.push(heal);
    }

    return healLevels;
}

function Earthquake(magicalDamage){
    var damageLevels = [];

    var percentageIncreases = [115.0, 120.0, 125.0, 135.0, 145.0];

    var relicBonus = document.getElementById('relicBonus').checked ? 0.12 : 0;
    var earthquakeBonus = (parseFloat(document.getElementById('earthquakeBonus').value) || 0) / 100;

    for (var level = 0; level < 5; level++) {
        var damage = magicalDamage * (percentageIncreases[level] / 100 + earthquakeBonus) * (1 + relicBonus);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function LightningShield(magicalDamage){
    var damageLevels = [];

    var percentageIncreases = [85.0, 90.0, 100.0, 110.0];

    var staticDischargeBonus = document.getElementById('staticDischarge').checked ? 0.2 : 0;
    var lightningShieldBonusI = (parseFloat(document.getElementById('lightningShieldBonusI').value) || 0) / 100;
    var lightningShieldBonusII = document.getElementById('lightningShieldBonusII').checked ? 0.06 : 0;

    for (var level = 0; level < 4; level++) {
        var damage = magicalDamage * (percentageIncreases[level] / 100 + lightningShieldBonusI + lightningShieldBonusII) * (1 + staticDischargeBonus);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function FireTotem(magicalDamage){
    var damageLevels = [];

    var percentageIncreases = [105.0, 110.0, 120.0, 135.0];

    var fireTotemBonus = (parseFloat(document.getElementById('fireTotemBonus').value) || 0) / 100;

    for (var level = 0; level < 4; level++) {
        var damage = magicalDamage * (percentageIncreases[level] / 100 + fireTotemBonus);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function FireTotemTick(magicalDamage){
    var damageLevels = [];

    var percentageIncreases = [20.0, 22.0, 24.0, 26.0];

    var fireTotemBonus = (parseFloat(document.getElementById('fireTotemBonus').value) || 0) / 100;

    for (var level = 0; level < 4; level++) {
        var damage = magicalDamage * (percentageIncreases[level] / 100 + fireTotemBonus);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function AncestorsHand(magicalDamage){
    var shieldLevels = [];

    var percentageIncreases = [130.0, 150.0, 170.0, 200.0];


    for (var level = 0; level < 4; level++) {
        var shield = magicalDamage * (percentageIncreases[level] / 100);
        shieldLevels.push(shield);
    }

    return shieldLevels;
}

function HealingTotem(magicalDamage, health){
    var healLevels = [];

    var percentageIncreases = [25.0, 30.0, 35.0, 45.0];

    var favorOfSpiritsBonus = document.getElementById('favorOfSpirits').checked ? 0.1 : 0;
    var healTotemBonus = document.getElementById('healTotemBonus').checked ? 0.02 : 0;

    for (var level = 0; level < 4; level++) {
        var heal = magicalDamage * (percentageIncreases[level] / 100 + healTotemBonus) + (health * favorOfSpiritsBonus);
        healLevels.push(heal);
    }

    return healLevels;
}

function Electrification(magicalDamage){
    var damageLevels = [];

    var percentageIncrease = 40;

    var damage = magicalDamage * (percentageIncrease / 100);
    damageLevels.push(damage);

    return damageLevels;
}

function AnsestralCharm(magicalDamage){
    var healLevels = [];

    var percentageIncrease = 100;

    var heal = magicalDamage * (percentageIncrease / 100);
    healLevels.push(heal);

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
