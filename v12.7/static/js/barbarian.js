document.getElementById('calcForm').addEventListener('submit', function (event) {
    event.preventDefault();

    var physicalDamage = parseFloat(document.getElementById('physdmg').value) || 0;
    var health = parseFloat(document.getElementById('health').value) || 0;

    var heavyStrikeDamage = calculateDamage(HeavyStrike(physicalDamage));
    var slashDamage = calculateDamage(Slash(physicalDamage));
    var dashDamage = calculateDamage(Dash(physicalDamage));
    var battleFuryHeal = calculateHeal(BattleFury(health));
    var battleFuryTickHeal = calculateHeal(BattleFuryTick(health));
    var shieldBashDamage = calculateDamage(ShieldBash(physicalDamage), false, false);
    var crushDamage = calculateDamage(Crush(physicalDamage), false, false);
    var crushBuffedDamage = calculateDamage(CrushBuffed(physicalDamage), false, false);
    var crushMassDamage = calculateDamage(CrushMass(physicalDamage), false, false);
    var bloodshedDamage = calculateDamage(Bloodshed(physicalDamage), true, false);

    updateDamageValues(heavyStrikeDamage, "heavyStrikeRow");
    updateDamageValues(slashDamage, "slashRow");
    updateDamageValues(dashDamage, "dashRow");
    updateDamageValues(battleFuryHeal, "battleFuryRow");
    updateDamageValues(battleFuryTickHeal, "battleFuryTickRow");
    updateDamageValues(shieldBashDamage, "shieldBashRow");
    updateDamageValues(crushDamage, "crushRow");
    updateDamageValues(crushBuffedDamage, "crushBuffedRow");
    updateDamageValues(crushMassDamage, "crushMassRow");
    updateDamageValues(bloodshedDamage, "bloodshedRow");
});

function calculateDamage(skillDamageLevels, isTalent=false, isBasicSkill=true) {
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
    var exclusiveAttackBonus = (isBasicSkill ? (document.getElementById('exclusiveAttackBonus').checked ? 0.10 : 0) : 0)

    var archenemyBonus = (isPVPTarget ? 0 : (parseFloat(document.getElementById('archenemyBonus').value) || 0) / 100);

    for (var level = 0; level < skillDamageLevels.length; level++) {
        var skillDamage = skillDamageLevels[level];
        var totalDamage = skillDamage * (1 - targetPhysicalReduction) * (1 + talentPVEDmgBonusI + talentPVEDmgBonusII) * (1 - targetResilience) * (1 + ferocity) * (1 + castleDmg + exclusiveAttackBonus) * (1 + archenemyBonus);
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

function HeavyStrike(physicalDamage){
    var damageLevels = [];

    var baseValues = [20, 40, 60, 80, 100];
    var percentageIncreases = [120.0, 125.0, 130.0, 135.0, 145.0];

    var relicBonus = document.getElementById('relicBonus').checked ? 0.12 : 0;
    var unitedBonus = (parseFloat(document.getElementById('unitedAttackBonus').value) || 0) / 100;

    var strikeBonus = (parseFloat(document.getElementById('strikeBonus').value) || 0) + (parseFloat(document.getElementById('strikeBonusAlm').value) || 0) / 100;

    for (var level = 0; level < 5; level++) {
        var damage = (baseValues[level] + physicalDamage * (percentageIncreases[level] / 100 + strikeBonus)) * (1 + relicBonus + unitedBonus);
        damageLevels.push(damage);
    }

    return damageLevels;
}


function Slash(physicalDamage){
    var damageLevels = [];

    var percentageIncreases = [20.0, 25.0, 30.0, 35.0, 40.0];

    var slashBonus = (document.getElementById('slashBonus').checked ? 0.015 : 0) + (parseFloat(document.getElementById('slashBonusII').value) || 0) / 100;
    var relicBonus = document.getElementById('relicBonus').checked ? 0.12 : 0;

    for (var level = 0; level < 5; level++) {
        var damage = physicalDamage * (percentageIncreases[level] / 100 + slashBonus) * (1 + relicBonus);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function Dash(physicalDamage){
    var damageLevels = [];

    var percentageIncreases = [65.0, 70.0, 75.0, 80.0, 90.0];

    var relicBonus = document.getElementById('relicBonus').checked ? 0.12 : 0;

    for (var level = 0; level < 5; level++) {
        var damage = physicalDamage * (percentageIncreases[level] / 100) * (1 + relicBonus);
        damageLevels.push(damage);
    }

    return damageLevels;
}


function BattleFury(health){
    var healLevels = [];

    var percentageIncreases = [5.0, 6.0, 8.0, 10.0];
    var furyBonus = (parseFloat(document.getElementById('furyBonus').value) || 0) / 100;

    for (var level = 0; level < 4; level++) {
        var heal = health * (percentageIncreases[level] / 100 + furyBonus);
        healLevels.push(heal);
    }

    return healLevels;
}

function BattleFuryTick(health){
    var healLevels = [];

    var percentageIncreases = [1.5, 2, 3, 4];

    for (var level = 0; level < 4; level++) {
        var heal = health * (percentageIncreases[level] / 100);
        healLevels.push(heal);
    }

    return healLevels;
}

function ShieldBash(physicalDamage){
    var damageLevels = [];

    var percentageIncreases = [115.0, 120.0, 130.0, 140.0];


    for (var level = 0; level < 4; level++) {
        var damage = physicalDamage * (percentageIncreases[level] / 100);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function Crush(physicalDamage){
    var damageLevels = [];

    var percentageIncreases = [120.0, 125.0, 135.0, 150.0];

    var crushBonus = document.getElementById('crushBonus').checked ? 0.05 : 0;

    for (var level = 0; level < 4; level++) {
        var damage = physicalDamage * (percentageIncreases[level] / 100 + crushBonus);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function CrushBuffed(physicalDamage){
    var damageLevels = [];

    var percentageIncreases = [120.0, 125.0, 135.0, 150.0];

    var crushBonus = document.getElementById('crushBonus').checked ? 0.05 : 0;

    for (var level = 0; level < 4; level++) {
        var damage = physicalDamage * (percentageIncreases[level] / 100 + crushBonus) * (percentageIncreases[level] / 100 + crushBonus);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function CrushMass(physicalDamage){
    var damageLevels = [];

    var percentageIncreases = [80.0, 90.0, 105.0, 125.0];

    for (var level = 0; level < 4; level++) {
        var damage = physicalDamage * (percentageIncreases[level] / 100);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function Bloodshed(physicalDamage){
    var damageLevels = [];

    var percentageIncrease = 33.0;

    var damage = physicalDamage * (percentageIncrease / 100);
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
