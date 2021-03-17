windows=document.getElementById('windows');
macos=document.getElementById('macos');
linux=document.getElementById('linux');
other=document.getElementById('other');

const form = document.getElementById('vote-form');
form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const choice=document.querySelector('input[name=os]:checked').value;
    const selectedData={os:choice}

    fetch('http://localhost:8080/poll',{
        method: 'POST',
        body: JSON.stringify(selectedData),
        headers: new Headers({'Content-Type': 'application/json'})
    })
        .then((res)=>res.json())
        .then((data)=>console.log(data))
        .catch((err)=>console.error(err));
        
});

var eventSource =new EventSource("/poll/eventSource");
        eventSource.addEventListener("message",(e)=>{
        const jsondata=JSON.parse(e.data);
        console.log(jsondata.points);
    })



fetch('http://localhost:8080/poll')
    .then(res => res.json())
    .then((data)=>{
        console.log(data)
        const votes=data.votes
        const totalVotes=votes.length;
        //count the vote points for each os reduce-acc/current parameters

        voteCounts = votes.reduce((acc,vote)=>
            ((acc[vote.os]=(acc[vote.os] || 0)+parseInt(vote.points)),acc),{}
        );
        let dataPoints = [
            {  label: 'Windows',y:voteCounts.Windows },
            {  label: 'MacOs',y:voteCounts.MacOS },
            {  label: 'Linux',y:voteCounts.Linux  },
            {  label: 'Other',y:voteCounts.Other  },
        ];
        
        const chartContainer = document.querySelector('#chartContainer');
            if(chartContainer){
            var chart = new CanvasJS.Chart("chartContainer", {
                animationEnabled:true,
                theme:'theme1',
                title:{
                    text: `Total Votes ${totalVotes}`              
                },
                data:[
                        {
                            type : 'column',
                            dataPoints:dataPoints
                        }
                    ]
            });
            chart.render();
        }
        

        
    })

