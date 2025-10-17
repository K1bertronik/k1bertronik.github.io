document.getElementById('calcForm').addEventListener('submit', function (event) {
    event.preventDefault();

    var physicalDamage = parseFloat(document.getElementById('physdmg').value) || 0;
    var magicalDamage = parseFloat(document.getElementById('magicdmg').value) || 0;
    var health = parseFloat(document.getElementById('health').value) || 0;
	
	var purifyingDamage = calculateDamage(Purifying(physicalDamage), 'physical', false, true);
    var purifyingDotDamage = calculateDamage(PurifyingDot(magicalDamage), 'magical', false, true);
    var heavenLightHeal = calculateHeal(HeavenLight(magicalDamage));
    var divineLightbringerHeal = calculateHeal(DivineLightbringer(HeavenLight(magicalDamage)));
    var haradsBannerDamage = calculateDamage(HaradsBanner(magicalDamage), 'magical');
    var focusedAngerDamage = calculateDamage(FocusedAnger(physicalDamage), 'physical');
    var sunSealDamage = calculateDamage(SunSeal(magicalDamage, physicalDamage), (physicalDamage > magicalDamage) ? 'physical' : 'magical');
    var sunSealHeal = calculateHeal(SunSealHeal());
    var haradsCallDamage = calculateDamage(HaradsCall(magicalDamage), 'magical');
    var repellentStrikeDamage = calculateDamage(RepellentStrike(physicalDamage, health)[0], 'physical');
    var repellentStrikeHeal = calculateHeal(RepellentStrike(physicalDamage, health)[1]);
    var sacredShield = SacredShield(health);
    var paladinsPrayerDamage = calculateDamage(PaladinsPrayer(magicalDamage), 'magical');
    var paladinsPrayerCritDamage = calculateDamage(PaladinsPrayerCrit(magicalDamage), 'magical');
    var everburningCandleHeal = calculateHeal(EverburningCandle());
    var faithReckoningDamage = calculateDamage(FaithReckoning(magicalDamage), 'magical', true);
    var intercessionHeal = calculateHeal(Intercession(magicalDamage));

    updateDamageValues(purifyingDamage, "purifyingRow");
    updateDamageValues(purifyingDotDamage, "purifyingDotRow");
    updateDamageValues(heavenLightHeal, "heavenLightRow");
    updateDamageValues(divineLightbringerHeal, "divineLightbringerRow");
    updateDamageValues(haradsBannerDamage, "haradsBannerRow");
    updateDamageValues(focusedAngerDamage, "focusedAngerRow");
    updateDamageValues(sunSealDamage, "sunSealRow");
    updateDamageValues(sunSealHeal, "sunSealHealRow");
    updateDamageValues(haradsCallDamage, "haradsCallRow");
    updateDamageValues(repellentStrikeDamage, "repellentStrikeRow");
    updateDamageValues(repellentStrikeHeal, "repellentStrikeHealRow");
    updateDamageValues(sacredShield, "sacredShieldRow");
    updateDamageValues(paladinsPrayerDamage, "paladinsPrayerRow");
    updateDamageValues(paladinsPrayerCritDamage, "paladinsPrayerCritRow");
    updateDamageValues(everburningCandleHeal, "everburningCandleRow");
    updateDamageValues(faithReckoningDamage, "faithReckoningRow");
    updateDamageValues(intercessionHeal, "intercessionRow");
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

    var sacredTeachingBonus = (isPVPTarget ? 0 : (document.getElementById('sacredTeachingBonus').checked ? 0.15 : 0));

    for (var level = 0; level < skillDamageLevels.length; level++) {
        var skillDamage = skillDamageLevels[level];
        var totalDamage = skillDamage * (damageType === 'physical' ? (1 - targetPhysicalReduction) : (1 - targetMagicalReduction)) * (1 + talentPVEDmgBonusI + talentPVEDmgBonusII + sacredTeachingBonus) * (1 - targetResilience) * (1 + ferocity) * (1 + castleDmg + exclusiveAttackBonus);

        totalDamage = parseFloat(totalDamage.toFixed(2));

        totalDamageLevels.push(totalDamage);
    }

    return totalDamageLevels;
}

function calculateHeal(skillHealLevels) {
    var totalHealLevels = [];

    var castleHealBonus = (parseFloat(document.getElementById('castleHeal').value) || 0) / 100;
    var healPotBonus = (parseFloat(document.getElementById('healPot').value) || 0) / 100;
    var auraBonus = ((parseFloat(document.getElementById('lightAura').value) || 0) / 100) + document.getElementById('lightAuraBonus').checked ? 0.03 : 0;

    for (var level = 0; level < skillHealLevels.length; level++) {
        var skillHeal = skillHealLevels[level];
        var totalHeal = skillHeal * (1 + castleHealBonus + healPotBonus + auraBonus);
        totalHeal = parseFloat(totalHeal.toFixed(2));

        totalHealLevels.push(totalHeal);
    }

    return totalHealLevels;
}

function Purifying(physicalDamage){
    var damageLevels = [];
	
	var baseValues = [20, 40, 60, 80, 100];
    var percentageIncreases = [115.0, 120.0, 125.0, 130.0, 135.0];

    var relicBonus = document.getElementById('relicBonus').checked ? 0.12 : 0;
    var unitedBonus = (parseFloat(document.getElementById('unitedAttackBonus').value) || 0) / 100;

    var purifyingBonus = (parseFloat(document.getElementById('purifyingBonus').value) || 0) / 100;

    for (var level = 0; level < 5; level++) {
        var damage = baseValues[level] + physicalDamage * (percentageIncreases[level] / 100 + purifyingBonus) * (1 + relicBonus + unitedBonus);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function PurifyingDot(magicalDamage){
    var damageLevels = [];

	var baseValues = [10, 20, 27, 35, 45];
    var percentageIncreases = [35.0, 40.0, 45.0, 50.0, 55.0];

    var relicBonus = document.getElementById('relicBonus').checked ? 0.12 : 0;
    var unitedBonus = (parseFloat(document.getElementById('unitedAttackBonus').value) || 0) / 100;

    var purifyingDotBonus = (parseFloat(document.getElementById('purifyingDotBonus').value) || 0) / 100;

    for (var level = 0; level < 5; level++) {
        var damage = baseValues[level] + magicalDamage * (percentageIncreases[level] / 100 + purifyingDotBonus) * (1 + relicBonus + unitedBonus);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function HeavenLight(magicalDamage){
    var healLevels = [];

	var baseValues = [30, 55, 80, 105, 130];
    var percentageIncreases = [110.0, 115.0, 120.0, 130.0, 140.0];

    var heavenLightBonus = (parseFloat(document.getElementById('heavenLightBonus').value) || 0) / 100;

    for (var level = 0; level < 5; level++) {
        var heal = baseValues[level] + magicalDamage * (percentageIncreases[level] / 100 + heavenLightBonus);
        healLevels.push(heal);
    }

    return healLevels;
}

function DivineLightbringer(skillLevels){
    var healLevels = [];

    var percentageIncrease = 0.15;

    for (var level = 0; level < 5; level++) {
        var heal = skillLevels[level] * percentageIncrease;

        heal = parseFloat(heal.toFixed(2));
        healLevels.push(heal);
    }

    return healLevels;
}

function HaradsBanner(magicalDamage){
    var damageLevels = [];

    var percentageIncreases = [40.0, 45.0, 50.0, 60.0];
    var percentageBoost = [10.0, 15.0, 20.0, 25.0];

    var haradsBannerBonus = document.getElementById('haradsBannerBonus').checked ? 0.03 : 0;
    var haradsBannerBonusIII = (parseFloat(document.getElementById('haradsBannerBonusIII').value) || 0) / 100;

    for (var level = 0; level < 4; level++) {
        var damage = magicalDamage * (percentageIncreases[level] / 100 + haradsBannerBonus) * (1 + (percentageBoost[level] / 100 + haradsBannerBonusIII));
        damageLevels.push(damage);
    }

    return damageLevels;
}

function FocusedAnger(physicalDamage){
    var damageLevels = [];

    var percentageIncreases = [40.0, 45.0, 50.0, 60.0];
    var percentageBoost = [10.0, 15.0, 20.0, 25.0];

    var haradsBannerBonusIII = (parseFloat(document.getElementById('haradsBannerBonusIII').value) || 0) / 100;

    for (var level = 0; level < 4; level++) {
        var damage = physicalDamage * (percentageIncreases[level] / 100) * (1 + 0.1 + (percentageBoost[level] / 100 + haradsBannerBonusIII));
        damageLevels.push(damage);
    }

    return damageLevels;
}

function SunSeal(magicalDamage, physicalDamage){
    var damageLevels = [];

    var percentagePhysIncreases = [120.0, 130.0, 140.0, 155.0];
    var percentageMagIncreases = [135.0, 145.0, 160.0, 180.0];

    var sunSealBonus = document.getElementById('sunSealBonus').checked ? 0.08 : 0;

    for (var level = 0; level < 4; level++) {
        if (physicalDamage > magicalDamage) {
            var damage = physicalDamage * (percentagePhysIncreases[level] / 100);
        } else {
            var damage = magicalDamage * (percentageMagIncreases[level] / 100 + sunSealBonus);
        }
        damageLevels.push(damage);
    }

    return damageLevels;
}

function SunSealHeal(){
    var healLevels = [];

    var sunSealDamage = (parseFloat(document.getElementById('sunSealDamage').value) || 0);

    var percentageIncreases = [5.0, 10.0, 13.0, 16.0];

    var sunSealHealBonus = document.getElementById('sunSealHealBonus').checked ? 0.02 : 0;

    for (var level = 0; level < 4; level++) {
        var heal = sunSealDamage * (percentageIncreases[level] / 100) * (1 + sunSealHealBonus);
        healLevels.push(heal);
    }

    return healLevels;
}

function HaradsCall(magicalDamage){
    var damageLevels = [];

    var percentageIncreases = [140.0, 145.0, 155.0, 170.0];

    var haradsCallBonus = document.getElementById('haradsCallBonus').checked ? 0.08 : 0;

    for (var level = 0; level < 4; level++) {
        var damage = magicalDamage * (percentageIncreases[level] / 100 + haradsCallBonus);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function RepellentStrike(physicalDamage, health){
    var damageLevels = [];
    var healLevels = [];

    var percentageDamageIncreases = [130.0, 135.0, 145.0, 160.0];
    var percentageHealIncreases = [5.0, 8.0, 12.0, 15.0];

    for (var level = 0; level < 4; level++) {
        var damage = physicalDamage * (percentageDamageIncreases[level] / 100);
        var heal = health * (percentageHealIncreases[level] / 100);
        damageLevels.push(damage);
        healLevels.push(heal);
    }

    return [damageLevels, healLevels];
}

function SacredShield(health){
    var shieldLevels = [];

    var percentageIncreases = [10.0, 15.0, 20.0, 30.0];

    var sacredShieldBonus = (parseFloat(document.getElementById('sacredShieldBonus').value) || 0) / 100;
    var sacredShieldBonusII = (parseFloat(document.getElementById('sacredShieldBonusII').value) || 0) / 100;

    for (var level = 0; level < 4; level++) {
        var shield = health * (percentageIncreases[level] / 100) * (1 + sacredShieldBonus + sacredShieldBonusII);
        shield = parseFloat(shield.toFixed(2));

        shieldLevels.push(shield);
    }

    return shieldLevels;
}

function PaladinsPrayer(magicalDamage){
    var damageLevels = [];

    var percentageIncreases = [100.0, 110.0, 125.0, 140.0];

    for (var level = 0; level < 4; level++) {
        var damage = magicalDamage * (percentageIncreases[level] / 100);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function PaladinsPrayerCrit(magicalDamage){
    var damageLevels = [];

    var percentageIncreases = [120.0, 140.0, 160.0, 180.0];

    for (var level = 0; level < 4; level++) {
        var damage = magicalDamage * (percentageIncreases[level] / 100);
        damageLevels.push(damage);
    }

    return damageLevels;
}

function EverburningCandle(){
    var healLevels = [];

    var heal = (parseFloat(document.getElementById('candleHeal').value) || 0);
    var membersCount = (parseFloat(document.getElementById('membersCount').value) || 0) - 1;

    var healingPerMember = heal * (0.3 - 0.04 * membersCount);

    healLevels.push(healingPerMember);

    return healLevels;
}

function FaithReckoning(magicalDamage){
    var damageLevels = [];

    var percentageIncrease = 0.25;

    var damage = magicalDamage * percentageIncrease;

    damageLevels.push(damage);

    return damageLevels;
}

function Intercession(magicalDamage){
    var damageLevels = [];

    var percentageIncrease = 1;

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
