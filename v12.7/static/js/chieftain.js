document.getElementById('calcForm').addEventListener('submit', function (event) {
    event.preventDefault();

    var physicalDamage = parseFloat(document.getElementById('physdmg').value) || 0;
    var magicalDamage = parseFloat(document.getElementById('magicdmg').value) || 0;
    var maxHealth = parseFloat(document.getElementById('maxHealth').value) || 0;
    var currentHealth = parseFloat(document.getElementById('currentHealth').value) || 0;

    var blowOfSpiritsDamage = calculateDamage(BlowOfSpirits(physicalDamage, magicalDamage), 'magical');
    var eaglesEyeMagDamage = calculateDamage(EaglesEyeMag(magicalDamage), 'magical', false);
    var eaglesEyePhysDamage = calculateDamage(EaglesEyePhys(physicalDamage), 'physical', false);
    var bearStaminaHealthHeal = calculateHeal(BearStaminaHealth(maxHealth, currentHealth));
    var bearStaminaHeal = calculateHeal(BearStamina(magicalDamage));
    var wolfsAlacrityDamage = calculateDamage(WolfsAlacrity(physicalDamage, magicalDamage), (physicalDamage > magicalDamage) ? 'physical' : 'magical', false);
    var curseOfPlagueDamage = calculateDamage(CurseOfPlague(physicalDamage), 'physical', false, false, false);
    var swoopingArmyDamage = calculateDamage(SwoopingArmy(magicalDamage), 'magical', false, false, false);
    var frenzyDamage = calculateDamage(Frenzy(physicalDamage), 'physical', true, false, false);
    var ignitionDamage = calculateDamage(Ignition(magicalDamage), 'magical', false, true, false);

    updateDamageValues(blowOfSpiritsDamage, "blowOfSpiritsRow");
    updateDamageValues(eaglesEyeMagDamage, "eaglesEyeMagRow");
    updateDamageValues(eaglesEyePhysDamage, "eaglesEyePhysRow");
    updateDamageValues(bearStaminaHealthHeal, "bearStaminaHealthRow");
    updateDamageValues(bearStaminaHeal, "bearStaminaRow");
    updateDamageValues(wolfsAlacrityDamage, "wolfsAlacrityRow");
    updateDamageValues(curseOfPlagueDamage, "curseOfPlagueRow");
    updateDamageValues(swoopingArmyDamage, "swoopingArmyRow");
    updateDamageValues(frenzyDamage, "frenzyRow");
    updateDamageValues(ignitionDamage, "ignitionRow");
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

    var shivEarthBonus = (parseFloat(document.getElementById('shivEarthBonus').value) || 0) / 100;
    
    for (var level = 0; level < skillDamageLevels.length; level++) {
        var skillDamage = skillDamageLevels[level];
        var totalDamage = skillDamage * (1 - Math.max(0, (damageType === 'physical' ? targetPhysicalDefence : targetMagicalDefence) - (penetration + dotPenBonus + instPenBonus))) * (1 + talentDmgBonus + talentPVEDmgBonusI + talentPVEDmgBonusII) * (1 - targetResilience) * (1 + ferocity) * (1 + shivEarthBonus) * (1 + castleDmg + exclusiveAttackBonus);

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

function BlowOfSpirits(physicalDamage, magicalDamage){
    var damageLevels = [];

    var basePhysValues = [20, 40, 60, 80, 100];
    var baseMagValues = [30, 55, 80, 105, 130];

    var percentagePhysIncreases = [45.0, 50.0, 55.0, 65.0, 75.0];
    var percentageMagIncreases = [125.0, 130.0, 135.0, 145.0, 155.0];

    var relicBonus = document.getElementById('relicBonus').checked ? 0.12 : 0;
    var unitedBonus = (parseFloat(document.getElementById('unitedAttackBonus').value) || 0) / 100;

    var blowOfSpiritsBonus = (parseFloat(document.getElementById('blowOfSpiritsBonus').value) || 0) / 100;

    var blowOfSpiritsBonusAlm = document.getElementById('blowOfSpiritsBonusAlm').value;

    blowOfSpiritsBonusAlm = blowOfSpiritsBonusAlm.split(',');

    var physblowOfSpiritsBonusAlm = parseFloat(blowOfSpiritsBonusAlm[0]) / 100;
    var magblowOfSpiritsBonusAlm = parseFloat(blowOfSpiritsBonusAlm[1]) / 100;

    for (var level = 0; level < 5; level++) {
        
    var percentageMagIncreases = [125.0, 130.0, 135.0, 145.0, 155.0];
    var damage = ((basePhysValues[level] + physicalDamage * (percentagePhysIncreases[level] / 100 + physblowOfSpiritsBonusAlm)) + (baseMagValues[level] + magicalDamage * (percentagePhysIncreases[level] / 100 + blowOfSpiritsBonus + magblowOfSpiritsBonusAlm))) * (1 + relicBonus + unitedBonus);

        damageLevels.push(damage);
    }

    return damageLevels;
}

function EaglesEyeMag(magicalDamage){
    var damageLevels = [];

    var percentageIncreases = [30.0, 40.0, 45.0, 50.0, 60.0];

    var relicBonus = document.getElementById('relicBonus').checked ? 0.12 : 0;
    var eaglesEyeBonus = document.getElementById('eaglesEyeBonus').checked ? 0.03 : 0;

    var eaglesEyeBonusAlm = document.getElementById('eaglesEyeBonusAlm').value;

    eaglesEyeBonusAlm = eaglesEyeBonusAlm.split(',');

    var magEaglesEyeBonusAlm = parseFloat(eaglesEyeBonusAlm[1]) / 100;

    for (var level = 0; level < 5; level++) {
        var damage = magicalDamage * (percentageIncreases[level] / 100 + eaglesEyeBonus + magEaglesEyeBonusAlm) * (1 + relicBonus);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function EaglesEyePhys(physicalDamage){
    var damageLevels = [];

    var percentageIncreases = [10.0, 15.0, 20.0, 25.0, 30.0];

    var relicBonus = document.getElementById('relicBonus').checked ? 0.12 : 0;
    var eaglesEyeBonus = document.getElementById('eaglesEyeBonus').checked ? 0.03 : 0;
    var eaglesEyeBonusII = (parseFloat(document.getElementById('eaglesEyeBonusII').value) || 0) / 100;

    var eaglesEyeBonusAlm = document.getElementById('eaglesEyeBonusAlm').value;

    eaglesEyeBonusAlm = eaglesEyeBonusAlm.split(',');

    var physEaglesEyeBonusAlm = parseFloat(eaglesEyeBonusAlm[0]) / 100;

    for (var level = 0; level < 5; level++) {
        var damage = physicalDamage * (percentageIncreases[level] / 100 + eaglesEyeBonus + eaglesEyeBonusII + physEaglesEyeBonusAlm) * (1 + relicBonus);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function BearStaminaHealth(maxHealth, currentHealth){
    var healLevels = [];

    var percentageIncreases = [3.0, 4.0, 5.0, 6.0, 8.0];

    for (var level = 0; level < 5; level++) {
        var heal = (maxHealth - currentHealth) * (percentageIncreases[level] / 100);
        healLevels.push(heal);
    }

    return healLevels;
}

function BearStamina(magicalDamage){
    var healLevels = [];

    var percentageIncreases = [105.0, 115.0, 125.0, 135.0, 150.0];

    var bearStaminaBonusII = (parseFloat(document.getElementById('bearStaminaBonusII').value) || 0) / 100;
    var bearStaminaBonusIII = document.getElementById('bearStaminaBonusIII').checked ? 0.06 : 0;

    for (var level = 0; level < 5; level++) {
        var heal = magicalDamage * (percentageIncreases[level] / 100 + bearStaminaBonusII + bearStaminaBonusIII);
        healLevels.push(heal);
    }

    return healLevels;
}

function WolfsAlacrity(physicalDamage, magicalDamage){
    var damageLevels = [];

    var percentagePhysIncreases = [20.0, 25.0, 30.0, 35.0, 40.0];
    var percentageMagIncreases = [25.0, 30.0, 35.0, 40.0, 45.0];

    for (var level = 0; level < 5; level++) {
        if (physicalDamage > magicalDamage) {
            var damage = physicalDamage * (percentagePhysIncreases[level] / 100);
        } else {
            var damage = magicalDamage * (percentageMagIncreases[level] / 100);
        }
        damageLevels.push(damage);
    }

    return damageLevels;
}

function CurseOfPlague(physicalDamage){
    var damageLevels = [];

    var percentageIncreases = [14.0, 16.0, 18.0, 20.0];

    for (var level = 0; level < 4; level++) {
        var damage = physicalDamage * (percentageIncreases[level] / 100) ;
        damageLevels.push(damage);
    }

    return damageLevels;
}

function SwoopingArmy(magicalDamage){
    var damageLevels = [];

    var percentageIncreases = [35.0, 45.0, 50.0, 60.0];

    var swoopingArmyBonus = (parseFloat(document.getElementById('swoopingArmyBonus').value) || 0) / 100;

    for (var level = 0; level < 4; level++) {
        var damage = magicalDamage * (percentageIncreases[level] / 100 + swoopingArmyBonus) ;
        damageLevels.push(damage);
    }

    return damageLevels;
}

function Frenzy(physicalDamage){
    var damageLevels = [];

    var countOfHits = [3, 4, 4, 5];
    var percentageIncreases = [35.0, 45.0, 50.0, 60.0];

    var frenzyBonus = (parseFloat(document.getElementById('frenzyBonus').value) || 0) / 100;
    var frenzyBonusI = (parseFloat(document.getElementById('frenzyBonusI').value) || 0) / 100;

    for (var level = 0; level < 4; level++) {
        var damage = countOfHits[level] * (physicalDamage * (percentageIncreases[level] / 100 + frenzyBonus + frenzyBonusI));
        damageLevels.push(damage);
    }

    return damageLevels;
}

function Ignition(magicalDamage){
    var damageLevels = [];

    var percentageIncrease = 0.15;

    var damage = magicalDamage * percentageIncrease;
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
