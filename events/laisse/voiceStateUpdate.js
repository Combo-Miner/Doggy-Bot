const client = require('../../index')
const db = require("quick.db")
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
client.on("voiceStateUpdate", async (oldState,newState)=> {
    await sleep(500)
    let member = newState.member || oldState.member
    if (member.voice.channel == null) return;
    let data = db.get("doggy_" + member.guild.id)
    if (!data) return;
    let owner = data.find(x=> x.ownerID === member.id)
    let user = data.find(x => x.users.includes(member.id))
    if(!user && !owner) return;

    if(user && member.guild.members.cache.get(user.ownerID).voice.channelId && member.voice.channelId !== member.guild.members.cache.get(user.ownerID).voice.channelId) {
        return member.voice.setChannel(member.guild.members.cache.get(user.ownerID).voice.channelId)
    } 
    if(owner) {
        
        owner.users.forEach(x=> {
            if(member.guild.members.cache.get(x) && member.guild.members.cache.get(x).voice.channelId && member.voice.channelId !== member.guild.members.cache.get(x).voice.channelId) {
                return member.guild.members.cache.get(x).voice.setChannel(member.guild.members.cache.get(x).voice.channelId)
            }
        })

    }
})