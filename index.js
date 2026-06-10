
require("dotenv").config();
const {Client,GatewayIntentBits,Events}=require("discord.js");
const {joinVoiceChannel,createAudioPlayer,createAudioResource}=require("@discordjs/voice");
const play=require("play-dl");

const client=new Client({
 intents:[
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildVoiceStates,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent]
});

client.once(Events.ClientReady,()=>console.log(`Logged in as ${client.user.tag}`));

client.on(Events.MessageCreate,async message=>{
 if(message.author.bot) return;
 const [cmd,...args]=message.content.trim().split(/\s+/);
 if(cmd==="!play"){
   const url=args[0];
   if(!url) return message.reply("Usage: !play <YouTube URL>");
   const vc=message.member?.voice?.channel;
   if(!vc) return message.reply("Join a voice channel first.");
   try{
     const conn=joinVoiceChannel({
       channelId:vc.id,
       guildId:vc.guild.id,
       adapterCreator:vc.guild.voiceAdapterCreator
     });
     const stream=await play.stream(url);
     const player=createAudioPlayer();
     conn.subscribe(player);
     player.play(createAudioResource(stream.stream,{inputType:stream.type}));
     message.reply("Playing!");
   }catch(e){
     console.error(e);
     message.reply("Could not play audio.");
   }
 }
});

client.login(process.env.DISCORD_TOKEN);
