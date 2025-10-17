document.getElementById('calcForm').addEventListener('submit', function (event) {
    event.preventDefault();

    var magicalDamage = parseFloat(document.getElementById('magicdmg').value) || 0;
    var health = parseFloat(document.getElementById('health').value) || 0;

    var lightningBoltDamage = calculateDamage(LightningBolt(magicalDamage));
    var dewHeal = calculateHeal(HealingDew(magicalDamage));
    var insectSwarmDamage = calculateDamage(InsectSwarm(magicalDamage));
    var tornadoDamage = calculateDamage(Tornado(magicalDamage), false, false);
    var secretLinkHeal = calculateHeal(SecretLink(magicalDamage));
    var streamHeal = calculateHeal(InvigoratingStream(magicalDamage));
    var powerOfWaterDamage = calculateDamage(PowerOfWater(magicalDamage)[0], false, false);
    var powerOfWaterMassDamage = calculateDamage(PowerOfWater(magicalDamage)[1], false, false);
    var barrierHeal = calculateHeal(Barrier(magicalDamage, health));
    var nimbusHeal = calculateHeal(Nimbus(health));
    var waterSpiritDamage = calculateDamage(WaterSpirit(magicalDamage, health)[0], true, false);
    var waterSpiritHealth = WaterSpirit(magicalDamage, health)[1];

    updateDamageValues(lightningBoltDamage, "lightningBoltRow");
    updateDamageValues(dewHeal, "healingDewRow");
    updateDamageValues(insectSwarmDamage, "insectSwarmRow");
    updateDamageValues(tornadoDamage, "tornadoRow");
    updateDamageValues(secretLinkHeal, "secretLinkRow");
    updateDamageValues(streamHeal, "invigoStreamRow");
    updateDamageValues(powerOfWaterDamage, "powerOfWaterRow");
    updateDamageValues(powerOfWaterMassDamage, "powerOfWaterMassRow");
    updateDamageValues(barrierHeal, "barrierRow");
    updateDamageValues(nimbusHeal, "nimbusRow");
    updateDamageValues(waterSpiritDamage, "waterSpiritRow");
    updateDamageValues(waterSpiritHealth, "waterSpiritHealthRow");
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

    for (var level = 0; level < skillHealLevels.length; level++) {
        var skillHeal = skillHealLevels[level];
        var totalHeal = skillHeal * (1 + castleHealBonus + healPotBonus + healBonus);
        totalHeal = parseFloat(totalHeal.toFixed(2));

        totalHealLevels.push(totalHeal);
    }

    return totalHealLevels;
}

function LightningBolt(magicalDamage){
    var damageLevels = [];

    var baseValues = [30, 55, 80, 105, 130];
    var percentageIncreases = [110.0, 115.0, 120.0, 125.0, 130.0];

    var relicBonus = document.getElementById('relicBonus').checked ? 0.12 : 0;
    var unitedBonus = (parseFloat(document.getElementById('unitedAttackBonus').value) || 0) / 100;

    var lightningBoltBonus = (parseFloat(document.getElementById('lightningBoltBonus').value) || 0) / 100;

    for (var level = 0; level < 5; level++) {
        var damage = (baseValues[level] + magicalDamage * (percentageIncreases[level] / 100 + lightningBoltBonus)) * (1 + relicBonus + unitedBonus);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function HealingDew(magicalDamage){
    var healLevels = [];

    var baseValues = [6, 11, 16, 21, 26];
    var percentageIncreases = [30.0, 35.0, 40.0, 45.0, 55.0];

    var healingDewBonus = (parseFloat(document.getElementById('healingDewBonus').value) || 0) / 100;

    for (var level = 0; level < 5; level++) {
        var heal = (baseValues[level] + magicalDamage * (percentageIncreases[level] / 100 + healingDewBonus));
        healLevels.push(heal);
    }

    return healLevels;
}

function InsectSwarm(magicalDamage){
    var damageLevels = [];

    var percentageIncreases = [30.0, 35.0, 40.0, 45.0, 50.0];

    var relicBonus = document.getElementById('relicBonus').checked ? 0.12 : 0;
    var insectSwarmBonus = (parseFloat(document.getElementById('insectSwarmBonus').value) || 0) / 100;

    for (var level = 0; level < 5; level++) {
        var damage = magicalDamage * (percentageIncreases[level] / 100 + insectSwarmBonus) * (1 + relicBonus);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function Tornado(magicalDamage){
    var damageLevels = [];

    var percentageIncreases = [30.0, 40.0, 50.0, 60.0];

    var windstormBonus = document.getElementById('windstormBonus').checked ? 0.15 : 0;

    for (var level = 0; level < 4; level++) {
        var damage = magicalDamage * (percentageIncreases[level] / 100) * (1 + windstormBonus);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function SecretLink(magicalDamage){
    var healLevels = [];

    var percentageIncreases = [60.0, 70.0, 80.0, 100.0];


    for (var level = 0; level < 4; level++) {
        var heal = magicalDamage * (percentageIncreases[level] / 100);
        healLevels.push(heal);
    }

    return healLevels;
}

function InvigoratingStream(magicalDamage){
    var healLevels = [];

    var percentageIncreases = [20.0, 25.0, 30.0, 35.0];

    var invigoStreamBonus = document.getElementById('invigoStreamBonus').checked ? 0.02 : 0;

    for (var level = 0; level < 4; level++) {
        var heal = magicalDamage * (percentageIncreases[level] / 100 + invigoStreamBonus);
        healLevels.push(heal);
    }

    return healLevels;
}

function PowerOfWater(magicalDamage){
    var damageLevels = [];
    var damageMassLevels = [];

    var percentageIncreases = [140.0, 150.0, 165.0, 180.0];
    var percentageMassIncreases = [60.0, 70.0, 80.0, 90.0];

    for (var level = 0; level < 4; level++) {
        var damage = magicalDamage * (percentageIncreases[level] / 100);
        var massDamage = magicalDamage * (percentageMassIncreases[level] / 100);

        damageLevels.push(damage);
        damageMassLevels.push(massDamage);
    }

    return [damageLevels, damageMassLevels];
}

function Barrier(magicalDamage, health){
    var healLevels = [];

    var percentageIncreases = [115.0, 130.0, 150.0, 180.0];

    var internalImpactBonus = document.getElementById('internalImpactBonus').checked ? 0.12 : 0;
    var barrierBonus = document.getElementById('barrierBonus').checked ? 0.06 : 0;

    for (var level = 0; level < 4; level++) {
        var heal = magicalDamage * (percentageIncreases[level] / 100) + (health * internalImpactBonus) * (1 + barrierBonus);
        healLevels.push(heal);
    }

    return healLevels;
}

function Nimbus(health){
    var healLevels = [];

    var percentageIncreases = [30.0, 35.0, 40.0, 45.0];

    var nimbusBonus = (parseFloat(document.getElementById('nimbusBonus').value) || 0) / 100;

    for (var level = 0; level < 4; level++) {
        var heal = health * (percentageIncreases[level] / 100 + nimbusBonus);
        healLevels.push(heal);
    }

    return healLevels;
}


function WaterSpirit(magicalDamage, health){
    var damageLevels = [];
    var healthLevels = [];

    var percentageIncrease = 1.2;
    var percentageHealthIncrease = 0.65;

    var damage = magicalDamage * percentageIncrease;
    var spiritHealth = health * percentageHealthIncrease;

    damageLevels.push(parseFloat(damage.toFixed(2)));
    healthLevels.push(parseFloat(spiritHealth.toFixed(2)));

    return [damageLevels, healthLevels];
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
