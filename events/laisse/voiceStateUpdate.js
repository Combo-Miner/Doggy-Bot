const client = require('../../index')
const db = require("quick.db")
client.on("voiceStateUpdate", async (oldState,newState)=> {
    let member = newState.member || oldState.member
    if (member.voice.channel == null) return;
    let data = db.all().filter(e => e.ID.startsWith("toutou_" + member.guild.id + "_" + member.id))
    let data2 = db.all().filter(e => e.ID.startsWith("toutou_" + member.guild.id + "_"))
    if (data2.map(r => r.ID.split("_")[3]).toString() == member.id) {
    
        if (member.guild.members.cache.get(data2.map(r => r.ID.split("_")[2]).toString()).voice.channelId && member.guild.members.cache.get(data2.map(r => r.ID.split("_")[2]).toString()).voice.channelId !== member.voice.channelId) {
            member.guild.members.cache.get(data2.map(r => r.ID.split("_")[2]).toString()).voice.setChannel(member.voice.channelId)
        }

    }
    data = data.map(r => r).map(r => r.ID).toString()
    if (data) {
        let owner = member.guild.members.cache.get(data.toString().split("_")[3])
        if (owner && owner.voice.channelId !== member.voice.channelId) {
            await member.voice.setChannel(owner.voice.channelId)
        }

    }
})