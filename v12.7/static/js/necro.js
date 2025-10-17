document.getElementById('calcForm').addEventListener('submit', function (event) {
    event.preventDefault();

    var magicalDamage = parseFloat(document.getElementById('magicdmg').value) || 0;
    var health = parseFloat(document.getElementById('health').value) || 0;

    var poisonSpittleDamage = calculateDamage(PoisonSpittle(magicalDamage));
    var poisonSpittleDotDamage = calculateDamage(PoisonSpittleDot(magicalDamage));
    var boneShield = BoneShield(magicalDamage);
    var ancientSealHeal = calculateHeal(AncientSeal(magicalDamage)[0]);
    var soulSynergyHeal = calculateHeal(AncientSeal(magicalDamage)[1]);
    var poisonShieldDamage = calculateDamage(PoisonShield(magicalDamage), false, false);
    var poisonShieldHeal = calculateHeal(PoisonShieldHeal(poisonShieldDamage));
    var infectionDamage = calculateDamage(Infection(magicalDamage, false), false, false);
    var infectionMassDamage = calculateDamage(Infection(magicalDamage, true), false, false);
    var acidRainDamage = calculateDamage(AcidRain(magicalDamage), false, false);
    var pleasureOfPain = calculateDamage(PleasureOfPain(magicalDamage), true, false);
    var deadWill = calculateHeal(DeadWill(health));

    updateDamageValues(poisonSpittleDamage, "poisonSpittleRow");
    updateDamageValues(poisonSpittleDotDamage, "poisonSpittleDotRow");
    updateDamageValues(boneShield, "boneShieldRow");
    updateDamageValues(ancientSealHeal, "ancientSealRow");
    updateDamageValues(soulSynergyHeal, "soulSynergyRow");
    updateDamageValues(poisonShieldDamage, "poisonShieldRow");
    updateDamageValues(poisonShieldHeal, "poisonShieldHealRow");
    updateDamageValues(infectionDamage, "infectionRow");
    updateDamageValues(infectionMassDamage, "infectionMassRow");
    updateDamageValues(acidRainDamage, "acidRainRow");
    updateDamageValues(pleasureOfPain, "pleasureOfPainRow");
    updateDamageValues(deadWill, "deadWillRow");
});

function calculateDamage(skillDamageLevels, isTalent=false, isBasicSkill=true) {
    var totalDamageLevels = [];

    var isPVPTarget = document.getElementById('pvpSwitch').checked;

    var penetration = (parseFloat(document.getElementById('penetration').value) || 0) / 100;
    var ferocity = (isPVPTarget ? (parseFloat(document.getElementById('ferocity').value) || 0) / 100 : 0);

    var targetMagicalDefence = (parseFloat(document.getElementById('targetMagicalDefencePercent').value) || 0) / 100;

    var targetMagicalReduction = (penetration > targetMagicalDefence) ? 0 : targetMagicalDefence - penetration;
    var targetResilience = (isPVPTarget ? (parseFloat(document.getElementById('targetResilience').value) || 0) / 100 : 0);

    var talentPVEDmgBonusI = (isPVPTarget || isTalent ? 0 : (parseFloat(document.getElementById('pveBonusI').value) || 0) / 100);
    var talentPVEDmgBonusII = (isPVPTarget ? 0 : (parseFloat(document.getElementById('pveBonusII').value) || 0) / 100);

    var castleDmg = (isTalent ? 0 : (parseFloat(document.getElementById('castleDmg').value) || 0) / 100);
    var exclusiveAttackBonus = (isBasicSkill ? (document.getElementById('exclusiveAttackBonus').checked ? 0.10 : 0) : 0);

    var bondsBonus = document.getElementById('bondsBonusAlm').checked ? 0.08 : 0;

    for (var level = 0; level < skillDamageLevels.length; level++) {
        var skillDamage = skillDamageLevels[level];
        var totalDamage = skillDamage * (1 - targetMagicalReduction) * (1 + talentPVEDmgBonusI + talentPVEDmgBonusII) * (1 - targetResilience) * (1 + ferocity) * (1 + castleDmg + exclusiveAttackBonus) * (1 + bondsBonus);
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

    var bondsBonus = document.getElementById('bondsBonusAlm').checked ? 0.08 : 0;

    for (var level = 0; level < skillHealLevels.length; level++) {
        var skillHeal = skillHealLevels[level];
        var totalHeal = skillHeal * (1 + castleHealBonus + healPotBonus + healBonus + bondsBonus);
        totalHeal = parseFloat(totalHeal.toFixed(2));

        totalHealLevels.push(totalHeal);
    }

    return totalHealLevels;
}

function PoisonSpittle(magicalDamage){
    var damageLevels = [];

    var baseValues = [30, 55, 80, 105, 130];
    var percentageIncreases = [110.0, 115.0, 120.0, 125.0, 130.0];

    var relicBonus = document.getElementById('relicBonus').checked ? 0.12 : 0;
    var unitedBonus = (parseFloat(document.getElementById('unitedAttackBonus').value) || 0) / 100;

    var poisonSpitBonus = (parseFloat(document.getElementById('poisonSpitBonus').value) || 0) / 100;

    for (var level = 0; level < 5; level++) {
        var damage = (baseValues[level] + magicalDamage * (percentageIncreases[level] / 100 + poisonSpitBonus)) * (1 + relicBonus + unitedBonus);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function PoisonSpittleDot(magicalDamage){
    var damageLevels = [];

    var baseValues = [10, 18, 26, 35, 45];
    var percentageIncreases = [20.0, 25.0, 30.0, 35.0, 40.0];

    var relicBonus = document.getElementById('relicBonus').checked ? 0.12 : 0;
    var unitedBonus = (parseFloat(document.getElementById('unitedAttackBonus').value) || 0) / 100;

    var poisonSpitBonus = (parseFloat(document.getElementById('poisonSpitBonus').value) || 0) / 100;

    for (var level = 0; level < 5; level++) {
        var damage = (baseValues[level] + magicalDamage * (percentageIncreases[level] / 100 + poisonSpitBonus)) * (1 + relicBonus + unitedBonus);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function BoneShield(magicalDamage){
    var shieldLevels = [];

    var baseValues = [30, 60, 90, 120, 150];
    var percentageIncreases = [90.0, 100.0, 115.0, 130.0, 150.0];

    var boneShieldBonus = document.getElementById('boneShieldBonus').checked ? 0.10 : 0;
    var boneShieldBonusAlm = (parseFloat(document.getElementById('boneShieldBonusAlm').value) || 0) / 100;

    for (var level = 0; level < 5; level++) {
        var shield = baseValues[level] + magicalDamage * (percentageIncreases[level] / 100 + boneShieldBonus + boneShieldBonusAlm);
        shieldLevels.push(parseFloat(shield.toFixed(2)));
    }

    return shieldLevels;
}

function AncientSeal(magicalDamage){
    var healLevels = [];
    var healSynergyLevels = [];

    var baseValues = [30, 55, 80, 105, 130];
    var percentageIncreases = [115.0, 120.0, 130.0, 140.0, 155.0];

    var ancientSealBonus = (parseFloat(document.getElementById('ancientSealBonus').value) || 0) / 100;
    var ancientSealBonusAlm = (parseFloat(document.getElementById('ancientSealBonusAlm').value) || 0) / 100;

    for (var level = 0; level < 5; level++) {
        var heal = (baseValues[level] + magicalDamage * (percentageIncreases[level] / 100 + ancientSealBonus + ancientSealBonusAlm));
        healLevels.push(heal);
        healSynergyLevels.push(heal * 0.4);
    }

    return [healLevels, healSynergyLevels];
}

function PoisonShield(magicalDamage){
    var damageLevels = [];

    var percentageIncreases = [25.0, 30.0, 35.0, 40.0];

    var poisonShieldBonusI = (parseFloat(document.getElementById('poisonShieldBonusI').value) || 0) / 100;
    var poisonShieldBonusIII = document.getElementById('poisonShieldBonusIII').checked ? 0.03 : 0;
    var poisonShieldBonusAlm = (parseFloat(document.getElementById('poisonShieldBonusAlm').value) || 0) / 100;

    for (var level = 0; level < 4; level++) {
        var damage = magicalDamage * (percentageIncreases[level] / 100 + poisonShieldBonusI + poisonShieldBonusIII + poisonShieldBonusAlm);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function PoisonShieldHeal(damageLevels){
    var healLevels = [];

    var percentageIncreases = [80.0, 90.0, 100.0, 110.0];

    for (var level = 0; level < 4; level++) {
        var heal = damageLevels[level] * (percentageIncreases[level] / 100);
        healLevels.push(heal);
    }

    return healLevels;
}

function Infection(magicalDamage, isMass){
    var damageLevels = [];

    var percentageIncreases = [135.0, 145.0, 160.0, 180.0];
    var percentageBoost = [12.0, 14.0, 16.0, 20.0];

    var infectionBonus = document.getElementById('infectionBonus').checked ? 0.02 : 0;

    for (var level = 0; level < 4; level++) {
        var damage = magicalDamage * (percentageIncreases[level] / 100) * (1 + (isMass ? 0 : (percentageBoost[level] / 100 + infectionBonus)));
        damageLevels.push(damage);
    }

    return damageLevels;
}

function AcidRain(magicalDamage){
    var damageLevels = [];

    var percentageIncreases = [30.0, 35.0, 40.0, 45.0];

    for (var level = 0; level < 4; level++) {
        var damage = magicalDamage * (percentageIncreases[level] / 100);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function PleasureOfPain(magicalDamage){
    var damageLevels = [];

    var percentageIncrease = 30;

    var damage = magicalDamage * (percentageIncrease / 100);
    damageLevels.push(damage);

    return damageLevels;
}

function DeadWill(health){
    var healLevels = [];

    var percentageIncrease = 0.05;

    var heal = health * percentageIncrease;
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
