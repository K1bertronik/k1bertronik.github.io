document.getElementById('calcForm').addEventListener('submit', function (event) {
    event.preventDefault();

    var physicalDamage = parseFloat(document.getElementById('physdmg').value) || 0;
    var magicalDamage = parseFloat(document.getElementById('magicdmg').value) || 0;
    var health = parseFloat(document.getElementById('health').value) || 0;
    var isRelentless = document.getElementById('isRelentless').checked;

	var blameDamage = calculateDamage(Blame(magicalDamage), 'magical', false, true);
    var whirlwindDamage = calculateDamage(Whirlwind(physicalDamage), 'physical', false, true);
    var combatSupportShield = CombatSupport(physicalDamage, magicalDamage);
    var haradsTeachingDamage = calculateDamage(HaradsTeaching(physicalDamage, magicalDamage), (physicalDamage > magicalDamage) ? 'physical' : 'magical');
    var haradsTeachingHeal = calculateHeal(HaradsTeachingHeal(magicalDamage)[0]);
    var haradsTeachingHealMember = calculateHeal(HaradsTeachingHeal(magicalDamage)[1]);
    var mantraHeal = calculateHeal(MantraOfHealing(health));
    var forbiddenTrickDamage = calculateDamage(ForbiddenTrick(physicalDamage), 'physical');
    var particleOfLifeDamage = calculateDamage(ParticleOfLife(physicalDamage, magicalDamage), (physicalDamage > magicalDamage) ? 'physical' : 'magical');
    var particleOfLifePetDamage = calculateDamage(ParticleOfLifePet(physicalDamage, magicalDamage, isRelentless), isRelentless ? 'physical' : 'magical')
    var brandedBySunHeal = calculateHeal(BrandedBySun(magicalDamage));
    var onslaughtDamage = calculateDamage(Onslaught(physicalDamage), 'physical');

    updateDamageValues(blameDamage, "blameRow");
    updateDamageValues(whirlwindDamage, "whirlwindRow");
    updateDamageValues(combatSupportShield, "combatSupportRow");
    updateDamageValues(haradsTeachingDamage, "haradsTeachingsRow");
    updateDamageValues(haradsTeachingHeal, "haradsTeachingsHealRow");
    updateDamageValues(haradsTeachingHealMember, "haradsTeachingsHealMemberRow");
    updateDamageValues(mantraHeal, "mantraOfHealingRow");
    updateDamageValues(forbiddenTrickDamage, "forbiddenTrickRow");
    updateDamageValues(particleOfLifeDamage, "particleOfLifeRow");
    updateDamageValues(particleOfLifePetDamage, "particleOfLifePetRow");
    updateDamageValues(brandedBySunHeal, "brandedBySunRow");
    updateDamageValues(onslaughtDamage, "onslaughtRow");
});

function calculateDamage(skillDamageLevels, damageType, isTalent=false, isBasicSkill=false) {
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
    var blessedStepBonus = (parseFloat(document.getElementById('blessedStep').value) || 0) / 100;

    for (var level = 0; level < skillHealLevels.length; level++) {
        var skillHeal = skillHealLevels[level];
        var totalHeal = skillHeal * (1 + castleHealBonus + healPotBonus + blessedStepBonus);
        totalHeal = parseFloat(totalHeal.toFixed(2));

        totalHealLevels.push(totalHeal);
    }

    return totalHealLevels;
}

function Blame(magicalDamage){
    var damageLevels = [];
	
	var baseValues = [30, 55, 80, 105, 130]
    var percentageIncreases = [115.0, 130.0, 145.0, 160.0, 175.0];

    var relicBonus = document.getElementById('relicBonus').checked ? 0.12 : 0;
    var unitedBonus = (parseFloat(document.getElementById('unitedAttackBonus').value) || 0) / 100;

    var blameBonus = (parseFloat(document.getElementById('blameBonus').value) || 0) / 100;

    for (var level = 0; level < 5; level++) {
        var damage = baseValues[level] + magicalDamage * (percentageIncreases[level] / 100 + blameBonus) * (1 + relicBonus + unitedBonus);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function Whirlwind(physicalDamage){
    var damageLevels = [];
	
	var baseValues = [20, 40, 60, 80, 100];
    var percentageIncreases = [85.0, 95.0, 105.0, 115.0, 125.0];

    var relicBonus = document.getElementById('relicBonus').checked ? 0.12 : 0;
    var whirlwindBonus = (parseFloat(document.getElementById('whirlwindBonus').value) || 0) / 100;

    for (var level = 0; level < 5; level++) {
        var damage = baseValues[level] + physicalDamage * (percentageIncreases[level] / 100 + whirlwindBonus) * (1 + relicBonus);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function CombatSupport(physicalDamage, magicalDamage){
    var shieldLevels = [];
	
    var percentageIncreases = [100.0, 120.0, 135.0, 155.0, 180.0];

    var combatSupportBonus = document.getElementById('combatSupportBonus').checked ? 0.15 : 0;

    for (var level = 0; level < 5; level++) {
        var shield = (physicalDamage + magicalDamage) * (percentageIncreases[level] / 100) * (1 + combatSupportBonus);
        shield = parseFloat(shield.toFixed(2));

        shieldLevels.push(shield);
    }

    return shieldLevels;
}

function HaradsTeaching(physicalDamage, magicalDamage){
	var damageLevels = [];
	
    var percentagePhysIncreases = [20.0, 30.0, 40.0, 50.0];
    var percentageMagIncreases = [30.0, 40.0, 50.0, 65.0];
	
	var haradsTeachingsBonusI = document.getElementById('haradsTeachingsBonusI').checked ? 0.05 : 0;
	
	for (var level = 0; level < 4; level++) {
        if (physicalDamage > magicalDamage) {
            var damage = physicalDamage * (percentagePhysIncreases[level] / 100 + haradsTeachingsBonusI);
        } else {
            var damage = magicalDamage * (percentageMagIncreases[level] / 100);
        }
        damageLevels.push(damage);
    }
	
	return damageLevels;
}

function HaradsTeachingHeal(magicalDamage){
    var healLevels = [];
	var healMemberLevels = [];

    var percentageIncreases = [40.0, 45.0, 55.0, 65.0];
    var percentageMemberIncreases = [20.0, 25.0, 35.0, 45.0];

    var haradsTeachingsBonusII = (parseFloat(document.getElementById('haradsTeachingsBonusII').value) || 0) / 100;

    for (var level = 0; level < 4; level++) {
        heal = magicalDamage * (percentageIncreases[level] / 100 + haradsTeachingsBonusII);
        healMember = magicalDamage * (percentageMemberIncreases[level] / 100 + haradsTeachingsBonusII);

        healLevels.push(heal);
        healMemberLevels.push(healMember);
    }

    return [healLevels, healMemberLevels];
}

function MantraOfHealing(health){
    var healLevels = [];

    var percentageIncreases = [2.0, 3.0, 4.0, 5.0];

    var mantraOfHealingBonus = document.getElementById('mantraOfHealingBonus').checked ? 0.005 : 0;

    for (var level = 0; level < 4; level++) {
        heal = health * (percentageIncreases[level] / 100 + mantraOfHealingBonus);

        healLevels.push(heal);
    }

    return healLevels;
}

function ForbiddenTrick(physicalDamage){
    var damageLevels = [];

    var percentageIncreases = [150.0, 165.0, 180.0, 200.0];

    var forbiddenTrickBonus = (parseFloat(document.getElementById('forbiddenTrickBonus').value) || 0) / 100;

    for (var level = 0; level < 4; level++) {
        var damage = physicalDamage * (percentageIncreases[level] / 100 + forbiddenTrickBonus);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function ParticleOfLife(physicalDamage, magicalDamage){
	var damageLevels = [];

    var percentagePhysIncreases = [120.0, 125.0, 135.0, 150.0];
    var percentageMagIncreases = [90.0, 100.0, 115.0, 130.0];

	var particleOfLifeBonus = document.getElementById('particleOfLifeBonus').checked ? 0.05 : 0;

    var relentlessBonus = document.getElementById('isRelentless').checked ? 0.5 : 0;

	for (var level = 0; level < 4; level++) {
        if (physicalDamage > magicalDamage) {
            var damage = physicalDamage * (percentagePhysIncreases[level] / 100 + particleOfLifeBonus) * (1 - relentlessBonus);
        } else {
            var damage = magicalDamage * (percentageMagIncreases[level] / 100 + particleOfLifeBonus) * (1 - relentlessBonus);
        }
        damageLevels.push(damage);
    }

	return damageLevels;
}

function ParticleOfLifePet(physicalDamage, magicalDamage, isRelentless){
	var damageLevels = [];

    var baseValues = [55, 80, 105, 130];
    var percentageIncreases = [65.0, 75.0, 85.0, 100.0];

    var particleOfLifeBonus = document.getElementById('particleOfLifeBonus').checked ? 0.05 : 0;

	for (var level = 0; level < 4; level++) {
        var damage = baseValues[level] + (isRelentless ? physicalDamage : magicalDamage) * (percentageIncreases[level] / 100 + particleOfLifeBonus);
        damageLevels.push(damage);
    }

	return damageLevels;
}

function BrandedBySun(magicalDamage){
    var healLevels = [];

    var percentageIncreases = [110.0, 120.0, 130.0, 140.0];

    for (var level = 0; level < 4; level++) {
        heal = magicalDamage * (percentageIncreases[level] / 100);
        healLevels.push(heal);
    }

    return healLevels;
}

function Onslaught(physicalDamage){
    var damageLevels = [];

    var percentageIncreases = [115.0, 125.0, 140.0, 155.0];

    for (var level = 0; level < 4; level++) {
        var damage = physicalDamage * (percentageIncreases[level] / 100);
        damageLevels.push(damage);
    }

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
