document.getElementById('calcForm').addEventListener('submit', function (event) {
    event.preventDefault();

    var magicalDamage = parseFloat(document.getElementById('magicdmg').value) || 0;
    var health = parseFloat(document.getElementById('health').value) || 0;

    var haradsTearsDamage = calculateDamage(HaradsTears(magicalDamage), true, false, true);
    var wordOfPowerDamage = calculateDamage(WordOfPower(magicalDamage), true, false, true);
    var holyShield = HolyShield(magicalDamage);
    var healingTouchHeal = calculateHeal(HealingTouch(magicalDamage));
    var elusiveThreatDamage = calculateDamage(ElusiveThreat(magicalDamage)[0], false, false, false, ElusiveThreat(magicalDamage)[1]);
    var paybackDamage = calculateDamage(Payback(magicalDamage));
    var redemptionHeal = calculateHeal(Redemption(magicalDamage));
    var mysticMarkDamage = calculateDamage(MysticMark(magicalDamage));
    var aegisOfSinDamage = AegisOfSin(mysticMarkDamage);
    var punishOfLightDamage = calculateDamage(PunishOfLight(magicalDamage));
    var punishOfLightMassDamage = calculateDamage(PunishOfLightMass(magicalDamage));
    var punishOfPainDamage = calculateDamage(PunishOfPain(magicalDamage), true, true);

    updateDamageValues(haradsTearsDamage, "haradsTearsRow");
    updateDamageValues(wordOfPowerDamage, "wordOfPowerRow");
    updateDamageValues(holyShield, "holyShieldRow");
    updateDamageValues(healingTouchHeal, "healingTouchRow");
    updateDamageValues(elusiveThreatDamage, "elusiveThreatRow");
    updateDamageValues(paybackDamage, "paybackRow");
    updateDamageValues(redemptionHeal, "redemptionRow");
    updateDamageValues(mysticMarkDamage, "mysticMarkRow");
    updateDamageValues(aegisOfSinDamage, "aegisOfSinRow");
    updateDamageValues(punishOfLightDamage, "punishOfLightRow");
    updateDamageValues(punishOfLightMassDamage, "punishOfLightMassRow");
    updateDamageValues(punishOfPainDamage, "punishOfPainRow");
});

function calculateDamage(skillDamageLevels, isInstantDamage=true, isTalent=false, isBasicSkill=false, bonusPenetration=[]) {
    var totalDamageLevels = [];

    var isPVPTarget = document.getElementById('pvpSwitch').checked;

    var penetration = (parseFloat(document.getElementById('penetration').value) || 0) / 100;
    var ferocity = (isPVPTarget ? (parseFloat(document.getElementById('ferocity').value) || 0) / 100 : 0);

    var targetMagicalDefence = (parseFloat(document.getElementById('targetMagicalDefencePercent').value) || 0) / 100;

    var targetResilience = (isPVPTarget ? (parseFloat(document.getElementById('targetResilience').value) || 0) / 100 : 0);

    var talentPVEDmgBonusI = (isPVPTarget || isTalent ? 0 : (parseFloat(document.getElementById('pveBonusI').value) || 0) / 100);
    var talentPVEDmgBonusII = (isPVPTarget ? 0 : (parseFloat(document.getElementById('pveBonusII').value) || 0) / 100);

    var castleDmg = (isTalent ? 0 : (parseFloat(document.getElementById('castleDmg').value) || 0) / 100);
    var exclusiveAttackBonus = (isBasicSkill ? (document.getElementById('exclusiveAttackBonus').checked ? 0.10 : 0) : 0);

    var drunkLightBonus = (isPVPTarget || !isInstantDamage ? 0 : (document.getElementById('drunkLightBonus').checked ? 0.15 : 0));

    var righteousnessBonus = document.getElementById('righteousnessBonus').checked ? 0.08 : 0;

    for (var level = 0; level < skillDamageLevels.length; level++) {
        var skillDamage = skillDamageLevels[level];
        var bonusPenetrationValue = bonusPenetration.length > level ? (bonusPenetration[level] / 100) : 0;
        var totalDamage = skillDamage * (1 - Math.max(0, targetMagicalDefence - (penetration + bonusPenetrationValue))) * (1 + talentPVEDmgBonusI + talentPVEDmgBonusII + drunkLightBonus) * (1 - targetResilience) * (1 + ferocity) * (1 + castleDmg + exclusiveAttackBonus) * (1 + righteousnessBonus);
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

    var righteousnessBonus = document.getElementById('righteousnessBonus').checked ? 0.08 : 0;

    for (var level = 0; level < skillHealLevels.length; level++) {
        var skillHeal = skillHealLevels[level];
        var totalHeal = skillHeal * (1 + castleHealBonus + healPotBonus + healBonus + righteousnessBonus);
        totalHeal = parseFloat(totalHeal.toFixed(2));

        totalHealLevels.push(totalHeal);
    }

    return totalHealLevels;
}

function HaradsTears(magicalDamage){
    var damageLevels = [];

    var baseValues = [30, 55, 80, 105, 130];
    var percentageIncreases = [110.0, 115.0, 120.0, 125.0, 130.0];

    var relicBonus = document.getElementById('relicBonus').checked ? 0.12 : 0;
    var unitedBonus = (parseFloat(document.getElementById('unitedAttackBonus').value) || 0) / 100;

    var haradsTearsBonus = (parseFloat(document.getElementById('haradsTearsBonus').value) || 0) / 100;
    var haradsTearsBonusI = document.getElementById('haradsTearsBonusI').checked ? 0.075 : 0;
    var haradsTearsBonusII = (parseFloat(document.getElementById('haradsTearsBonusII').value) || 0) / 100;
    var haradsTearsBonusAlm = (parseFloat(document.getElementById('haradsTearsBonusAlm').value) || 0) / 100;

    for (var level = 0; level < 5; level++) {
        var damage = (baseValues[level] + magicalDamage * (percentageIncreases[level] / 100 + haradsTearsBonus + haradsTearsBonusI + haradsTearsBonusII + haradsTearsBonusAlm)) * (1 + relicBonus + unitedBonus);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function WordOfPower(magicalDamage){
    var damageLevels = [];

    var percentageIncreases = [120.0, 125.0, 135.0, 145.0, 160.0];

    for (var level = 0; level < 5; level++) {
        var damage = magicalDamage * (percentageIncreases[level] / 100);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function HolyShield(magicalDamage){
    var shieldLevels = [];

    var baseValues = [30, 60, 90, 120, 150];
    var percentageIncreases = [90.0, 100.0, 115.0, 130.0, 150.0];

    var holyShieldBonus = document.getElementById('holyShieldBonus').checked ? 0.10 : 0;
    var holyShieldBonusAlm = (parseFloat(document.getElementById('holyShieldBonusAlm').value) || 0) / 100;

    for (var level = 0; level < 5; level++) {
        var shield = baseValues[level] + magicalDamage * (percentageIncreases[level] / 100 + holyShieldBonus + holyShieldBonusAlm);
        shield = parseFloat(shield.toFixed(2));

        shieldLevels.push(shield);
    }

    return shieldLevels;
}

function HealingTouch(magicalDamage){
    var healLevels = [];

    var baseValues = [30, 55, 80, 105, 130];
    var percentageIncreases = [115.0, 120.0, 130.0, 140.0, 155.0];

    var healingTouchBonus = (parseFloat(document.getElementById('healingTouchBonus').value) || 0) / 100;
    var healingTouchBonusAlm = (parseFloat(document.getElementById('healingTouchBonusAlm').value) || 0) / 100;

    for (var level = 0; level < 5; level++) {
        var heal = baseValues[level] + magicalDamage * (percentageIncreases[level] / 100 + healingTouchBonus + healingTouchBonusAlm);
        healLevels.push(heal);
    }

    return healLevels;
}

function ElusiveThreat(magicalDamage){
    var damageLevels = [];

    var percentageDamageIncreases = [55.0, 65.0, 75.0, 90.0];
    var penetrationBonus = [4.0, 8.0, 12.0, 15.0];


    for (var level = 0; level < 4; level++) {
        var damage = magicalDamage * (percentageDamageIncreases[level] / 100);
        damageLevels.push(damage);
    }

    return [damageLevels, penetrationBonus];
}

function Payback(magicalDamage){
    var damageLevels = [];

    var percentageIncreases = [145.0, 160.0, 180.0, 200.0];

    var paybackBonus = document.getElementById('paybackBonus').checked ? 0.10 : 0;

    var targetMaxHealth = parseFloat(document.getElementById('targetMaxHealth').value) || 0;
    var targetCurrentHealth = parseFloat(document.getElementById('targetCurrentHealth').value) || 0;

    for (var level = 0; level < 4; level++) {
        var damage = magicalDamage * (percentageIncreases[level] / 100 + paybackBonus) * (1 + (targetMaxHealth - targetCurrentHealth) / targetMaxHealth);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function Redemption(magicalDamage){
    var healLevels = [];

    var percentageIncreases = [150.0, 165.0, 185.0, 210.0];

    var redemptionBonus = (parseFloat(document.getElementById('redemptionBonus').value) || 0) / 100;

    for (var level = 0; level < 4; level++) {
        var heal = magicalDamage * (percentageIncreases[level] / 100 + redemptionBonus);
        healLevels.push(heal);
    }

    return healLevels;
}

function MysticMark(magicalDamage){
    var damageLevels = [];

    var percentageIncreases = [140.0, 150.0, 165.0, 185.0];

    var mysticMarkBonus = document.getElementById('mysticMarkBonus').checked ? 0.10 : 0;
    var mysticMarkBonusII = document.getElementById('mysticMarkBonusII').checked ? 0.09 : 0;
    var mysticMarkBonusAlm = (parseFloat(document.getElementById('mysticMarkBonusAlm').value) || 0) / 100;

    for (var level = 0; level < 4; level++) {
        var damage = magicalDamage * (percentageIncreases[level] / 100 + mysticMarkBonus + mysticMarkBonusII + mysticMarkBonusAlm);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function AegisOfSin(skillLevels){
    var damageLevels = [];

    var percentageIncrease = 0.25;

    for (var level = 0; level < 4; level++) {
        var damage = skillLevels[level] * percentageIncrease;
        damage = parseFloat(damage.toFixed(2));

        damageLevels.push(damage);
    }

    return damageLevels;
}

function PunishOfLight(magicalDamage){
    var damageLevels = [];

    var percentageIncreases = [120.0, 130.0, 145.0, 160.0];

    var punishOfLightBonus = document.getElementById('punishOfLightBonus').checked ? 0.08 : 0;

    for (var level = 0; level < 4; level++) {
        var damage = magicalDamage * (percentageIncreases[level] / 100 + punishOfLightBonus);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function PunishOfLightMass(magicalDamage){
    var damageLevels = [];

    var percentageIncreases = [100.0, 105.0, 115.0, 130.0];

    var punishOfLightBonus = document.getElementById('punishOfLightBonus').checked ? 0.08 : 0;

    for (var level = 0; level < 4; level++) {
        var damage = magicalDamage * (percentageIncreases[level] / 100 + punishOfLightBonus);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function PunishOfPain(magicalDamage){
    var damageLevels = [];

    var percentageIncrease = 30;

    var damage = magicalDamage * (percentageIncrease / 100);
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
