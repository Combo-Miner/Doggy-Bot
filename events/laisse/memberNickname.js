const client = require("../../index")

const db = require("quick.db")
client.on("guildMemberUpdate", async (oldMember,newMember) => {
      let logs = await oldMember.guild.fetchAuditLogs({
        type: 'MEMBER_UPDATE'
    }).then(audit => audit.entries.first())
    if(logs.executor.id == client.user.id) return;

    const data2 = db.all().filter(e => e.ID.startsWith("toutou_" + oldMember.guild.id + "_"))
    if(data2.some(r => r.ID.split("_")[2] == oldMember.id)) {
        if(oldMember.nickname !== newMember.nickname) {
           oldMember.setNickname(oldMember.nickname).catch((e) => {console.log(e)})
            return;
        }
    }

})