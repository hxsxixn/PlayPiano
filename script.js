var soundpack=[];
var soundpack_index=[1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,6,6.5,7,8,8.5,9,9.5,10,11,11.5,12,12.5,13,13.5,14,15]
var keyboard_data=[
      {num: 1,key: 90  ,type:'white'},
      {num: 1.5,key: 83  ,type:'black'},
      {num: 2,key: 88  ,type:'white'},
      {num: 2.5,key: 68  ,type:'black'},
      {num: 3,key: 67  ,type:'white'},
      {num: 4,key: 86  ,type:'white'},
      {num: 4.5,key: 71  ,type:'black'},
      {num: 5,key: 66  ,type:'white'},
      {num: 5.5,key: 72  ,type:'black'},
      {num: 6,key: 78  ,type:'white'},
      {num: 6.5,key: 74  ,type:'black'},
      {num: 7,key: 77  ,type:'white'},
      {num: 8,key: 81  ,type:'white'},
      {num: 8.5,key: 50  ,type:'black'},
      {num: 9,key: 87  ,type:'white'},
      {num: 9.5,key: 51,type:'black'},
      {num: 10,key: 69  ,type:'white'},
      {num: 11,key: 82  ,type:'white'},
      {num: 11.5,key: 53  ,type:'black'},
      {num: 12,key: 84  ,type:'white'},
      {num: 12.5,key: 54  ,type:'black'},
      {num: 13,key: 89  ,type:'white'},
      {num: 13.5,key: 55  ,type:'black'},
      {num: 14,key: 85  ,type:'white'},
      {num: 15,key: 73  ,type:'white'}
    ]
var sample_url="https://awiclass.monoame.com/api/command.php?type=get&name=music_dodoro";

for(var i=0;i<soundpack_index.length;i++){
  soundpack.push({
    name: soundpack_index[i],url:"https://awiclass.monoame.com/pianosound/set/"+soundpack_index[i]+".wav"
  })
};

var vm=new Vue({
  el:"#app",
  data:{
    sounddata: soundpack,
    notes:[{"num": 8, "time": 306},{"num": 7, "time": 490},{"num": 8, "time": 590},{"num": 12, "time": 690},{"num": 13, "time": 795},{"num": 13, "time": 899},{"num": 13,"time": 1047},{"num": 12,"time": 1095},{"num": 9,"time": 1199},{"num": 10,"time": 1299},{"num": 11,"time": 1400},{"num": 11,"time": 1503},{"num": 10,"time": 1603},{"num": 10,"time": 1707},{"num": 8,"time": 1926},{"num": 7,"time": 2103},{"num": 8,"time": 2205},{"num": 10,"time": 2304},{"num": 11,"time": 2401},{"num": 11,"time": 2510},{"num": 11,"time": 2660},{"num": 8,"time": 2717},{"num": 8,"time": 2825},{"num": 8,"time": 2921},{"num": 9,"time": 3024},{"num": 8,"time": 3126},{"num": 7,"time": 3318},{"num": "END","time": 3521}],
    now_note_id:0,
    next_id:0,
    playing_time:0,
    record_time:0,
    player: null,
    recorder: null,
    keyboard: keyboard_data,
    now_presskey:-1,
    sheet_roll:0,
  },
  methods:{
    playnote: function(id,volume){
      if (id>0){
        var audio_obj=$("audio[sound-num='"+id+"']")[0];
        audio_obj.volume=volume;
        audio_obj.currentTime=0;
        audio_obj.play();}
    },
    playnext: function(volume){
      var now_note=this.notes[this.now_note_id].num;
      this.playnote(now_note,volume);
      this.now_note_id+=1;
      this.sheetroll(1);
      // this.sheet_roll+=1;
      // var roll=(this.sheet_roll-1)*(-40);
      if(this.now_note_id>=this.notes.length){
        this.stop_play();
      };
      // if(this.sheet_roll>1){
      //   $("ul").css("transform","translateX("+roll+"px)")}
      
    },
    start: function(){
      // this.now_note_id=0;
      // this.next_id=0;
      // this.playing_time=0;
      // this.sheet_roll=0;
      this.stop_play();
      var vobj=this;
      this.player=setInterval(function(){
        if(vobj.playing_time>=vobj.notes[vobj.now_note_id].time){
          $(".viewbox").addClass("light");
          vobj.playnext(0.8);
          // var roll=vobj.sheet_roll*(-37);
          // $("ul").css("transform","translateX("+roll+"px)");
          // vobj.sheet_roll++
          // vobj.next_id++;
        }
        vobj.playing_time++;
      })
      },
    stop_play: function(){
      clearInterval(this.player);
      this.now_note_id=0;
      this.next_id=0;
      this.playing_time=0;
      this.sheet_roll=0;
      $("ul").css("transform","translateX(0px)");
      $(".viewbox").removeClass("light");
    },
    currnt_note: function(n,b){
      if(this.now_presskey==b) return true;
      if (this.notes.length==0) return false;
      var cur_note=this.now_note_id-1;
      if (cur_note<0) return false ;
      var cur_num=this.notes[cur_note].num;
      if (n==cur_num) return true; return false;
      
    },
    record: function(){
      this.notes=[];
      this.stop_play();
      this.record_time=0;
      $(".viewbox").addClass("light");
      this.recorder=setInterval(function(){
        vm.record_time++;
      })
    },
    stop_record: function(){
      this.notes.push({num:"END",time:this.record_time});
      clearInterval(this.recorder);
      this.record_time=0;
      $(".viewbox").removeClass("light");
    },
    addnote: function(id){
      if(this.record_time>1){
        this.notes.push({num:id,time:this.record_time});
        this.sheetroll(5);
      };
      this.playnote(id,0.8);
      // $(".viewbox").addClass("light");
    },
    sheetroll: function(B){
      this.sheet_roll+=1;
      var roll=(this.sheet_roll-B)*(-41);
      if(this.sheet_roll>B)
      {$("ul").css("transform","translateX("+roll+"px)")};
    },
    load_sample: function(){
      this.stop_play();
      var vobj=this;
      $.ajax({
  url: sample_url,
  success: function(res){
  vobj.notes=JSON.parse(res);
  }
});
      
    },
  }
});

$(window).keydown(function(e){
  var key=e.which;
  vm.now_presskey=key;
  console.log(key);
  for(var i=0;i<vm.keyboard.length;i++){
    if(key==vm.keyboard[i].key){vm.addnote(vm.keyboard[i].num);}
  }
});

$(window).keyup(function(){
  vm.now_presskey=-1
});

var kb_place=$(".pianokey").offset().top;
$(".press").css("top",0-kb_place);