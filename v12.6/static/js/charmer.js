document.getElementById('calcForm').addEventListener('submit', function (event) {
    event.preventDefault();

    var physicalDamage = parseFloat(document.getElementById('physdmg').value) || 0;
    var magicalDamage = parseFloat(document.getElementById('magicdmg').value) || 0;
    var health = parseFloat(document.getElementById('health').value) || 0;
	
	var darkPrismDamage = calculateDamage(DarkPrism(physicalDamage, magicalDamage), (physicalDamage > magicalDamage) ? 'physical' : 'magical');
	var combatInstantHeal = calculateHeal(CombatHealing(magicalDamage)[0]);
	var combatHeal = calculateHeal(CombatHealing(magicalDamage)[1]);
	var callDamage = calculateDamage(Call(physicalDamage), 'physical');
	var oppressionDamage = calculateDamage(Oppression(magicalDamage), 'magical');
	var knowledgeDamage = calculateDamage(Knowledge(physicalDamage, magicalDamage), (physicalDamage > magicalDamage) ? 'physical' : 'magical', false, false);
	var otherworldFireDamage = calculateDamage(OtherworldFire(magicalDamage, false), 'magical', false, false);
	var embraceOfDarknessDamage = calculateDamage(OtherworldFire(magicalDamage, true), 'magical', false, false);
	var plaguedMinionDamage = calculateDamage(PlaguedMinion(physicalDamage, magicalDamage), 'physical', true, false);
	
    updateDamageValues(darkPrismDamage, "darkPrismRow");
    updateDamageValues(combatInstantHeal, "combatHealInstantRow");
    updateDamageValues(combatHeal, "combatHealRow");
    updateDamageValues(callDamage, "callRow");
    updateDamageValues(oppressionDamage, "oppressionRow");
    updateDamageValues(knowledgeDamage, "knowledgeRow");
    updateDamageValues(otherworldFireDamage, "otherWorldFireRow");
    updateDamageValues(embraceOfDarknessDamage, "embraceOfDarknessRow");
    updateDamageValues(plaguedMinionDamage, "plaguedMinionRow");
	
});

function calculateDamage(skillDamageLevels, damageType, isTalent=false, isBasicSkill=true) {
    var totalDamageLevels = [];

    var isPVPTarget = document.getElementById('pvpSwitch').checked;

    var penetration = (parseFloat(document.getElementById('penetration').value) || 0) / 100;
    var ferocity = (isPVPTarget ? (parseFloat(document.getElementById('ferocity').value) || 0) / 100 : 0);

    var targetPhysicalDefence = (parseFloat(document.getElementById('targetPhysicalDefencePercent').value) || 0) / 100;

    var targetMagicalDefence = (parseFloat(document.getElementById('targetMagicalDefencePercent').value) || 0) / 100;

    var targetPhysicalReduction = (penetration > targetPhysicalDefence) ? 0 : targetPhysicalDefence - penetration;

    var targetMagicalReduction = (penetration > targetMagicalDefence) ? 0 : targetMagicalDefence - penetration;

    var targetResilience = (isPVPTarget ? (parseFloat(document.getElementById('targetResilience').value) || 0) / 100 : 0);

    var talentPVEDmgBonusI = (isPVPTarget || isTalent ? 0 : (parseFloat(document.getElementById('pveBonusI').value) || 0) / 100);
    var talentPVEDmgBonusII = (isPVPTarget ? 0 : (parseFloat(document.getElementById('pveBonusII').value) || 0) / 100);

    var castleDmg = (parseFloat(document.getElementById('castleDmg').value) || 0) / 100;
    var exclusiveAttackBonus = (isBasicSkill ? (document.getElementById('exclusiveAttackBonus').checked ? 0.10 : 0) : 0);

    for (var level = 0; level < skillDamageLevels.length; level++) {
        var skillDamage = skillDamageLevels[level];
        var totalDamage = skillDamage * (damageType === 'physical' ? (1 - targetPhysicalReduction) : (1 - targetMagicalReduction)) * (1 + talentPVEDmgBonusI + talentPVEDmgBonusII) * (1 - targetResilience) * (1 + ferocity) * (1 + castleDmg + exclusiveAttackBonus);

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

function DarkPrism(physicalDamage, magicalDamage){
    var damageLevels = [];

    var basePhysValues = [20, 40, 60, 80, 100];
    var baseMagValues = [30, 55, 80, 105, 130];

    var percentagePhysIncreases = [115.0, 120.0, 125.0, 130.0, 135.0];
    var percentageMagIncreases = [110.0, 115.0, 120.0, 125.0, 130.0];

    var relicBonus = document.getElementById('relicBonus').checked ? 0.12 : 0;
    var unitedBonus = (parseFloat(document.getElementById('unitedAttackBonus').value) || 0) / 100;

    var darkPrismBonus = (parseFloat(document.getElementById('darkPrismBonus').value) || 0) / 100;

    for (var level = 0; level < 5; level++) {
        if (physicalDamage > magicalDamage) {
            var damage = (basePhysValues[level] + physicalDamage * (percentagePhysIncreases[level] / 100)) * (1 + relicBonus + unitedBonus);
        } else {
            var damage = (baseMagValues[level] + magicalDamage * (percentageMagIncreases[level] / 100 + darkPrismBonus)) * (1 + relicBonus + unitedBonus);
        }
        damageLevels.push(damage);
    }

    return damageLevels;
}

function CombatHealing(magicalDamage){
    var instantHealLevels = [];
	var healLevels = [];
	
	var baseValues = [8, 14, 20, 26, 32];
	var percentageInstantIncreases = [30.0, 40.0, 50.0, 65.0, 75.0];
    var percentageIncreases = [15.0, 20.0, 25.0, 30.0, 35.0];
	
	var combatHealBonus = document.getElementById('combatHealBonus').checked ? 0.05 : 0;
    var combatHealBonusIII = (parseFloat(document.getElementById('combatHealBonusIII').value) || 0) / 100;

    for (var level = 0; level < 5; level++) {
		var instantHeal = magicalDamage * (percentageInstantIncreases[level] / 100 + combatHealBonus + combatHealBonusIII);
        var heal = (baseValues[level] + magicalDamage * (percentageIncreases[level] / 100 + combatHealBonus + combatHealBonusIII));
        
		instantHealLevels.push(instantHeal);
		healLevels.push(heal);
    }

    return [instantHealLevels, healLevels];
}

function Call(physicalDamage){
    var damageLevels = [];

    var percentageIncreases = [48.0, 54.0, 66.0, 78.0, 90.0];

    var relicBonus = document.getElementById('relicBonus').checked ? 0.12 : 0;
    var callBonus = (parseFloat(document.getElementById('callBonus').value) || 0) / 100;
	
	var summonerSkillBonus = ((parseFloat(document.getElementById('summonerSkill').value) || 0) / 100) + ((parseFloat(document.getElementById('summonerSkillBonus').value) || 0) / 100);
	
    for (var level = 0; level < 5; level++) {
        var damage = (physicalDamage * (percentageIncreases[level] / 100) + callBonus) * (1 + relicBonus) * (1 + summonerSkillBonus);
        damageLevels.push(damage);
	}
		
    return damageLevels;
}

function Oppression(magicalDamage){
    var damageLevels = [];
	
	var baseValues = [30, 55, 80, 105, 130];
    var percentageIncreases = [59.0, 55.0, 60.0, 65.0, 70.0];
	
    for (var level = 0; level < 5; level++) {
        var damage = baseValues[level] + magicalDamage * (percentageIncreases[level] / 100);
        damageLevels.push(damage);
	}
		
    return damageLevels;
}

function Knowledge(physicalDamage, magicalDamage){
    var damageLevels = [];


    var percentagePhysIncreases = [50.0, 65.0, 85.0, 110.0];
    var percentageMagIncreases = [65.0, 80.0, 100.0, 125.0];

    var knowledgeBonus = document.getElementById('knowledgeBonus').checked ? 0.05 : 0;

    for (var level = 0; level < 4; level++) {
        if (physicalDamage > magicalDamage) {
            var damage = physicalDamage * (percentagePhysIncreases[level] / 100 + knowledgeBonus);
        } else {
            var damage = magicalDamage * (percentageMagIncreases[level] / 100 + darkPrismBonus);
        }
        damageLevels.push(damage);
    }

    return damageLevels;
}

function OtherworldFire(magicalDamage, isEmbrace){
    var damageLevels = [];
	
    var percentageIncreases = [50.0, 55.0, 65.0, 80.0];
	
	var embraceBonus = isEmbrace ? 0.8 : 0;
	
    for (var level = 0; level < 4; level++) {
        var damage = magicalDamage * (percentageIncreases[level] / 100) * (1 + embraceBonus);
        damageLevels.push(damage);
	}
		
    return damageLevels;
}

function PlaguedMinion(physicalDamage, magicalDamage){
    var damageLevels = [];
	
    var percentagePhysIncrease = 0.1;
    var percentageMagIncrease = 0.2;
	
    var damage = physicalDamage * percentagePhysIncrease + magicalDamage * percentageMagIncrease;
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
