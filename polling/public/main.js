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
        

   
    fetch('http://localhost:8080/poll')
    .then(res => res.json())
    .then((data)=>{
        var ctx = document.getElementById('myChart').getContext('2d');
        const votes=data.votes
        const totalVotes=votes.length;
    
    //count the vote points for each os reduce-acc/current parameters

    voteCounts = votes.reduce((acc,vote)=>
        ((acc[vote.os]=(acc[vote.os] || 0)+parseInt(vote.points)),acc),{}
    );
 var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
    labels: ['Windows', 'MacOs', 'Linux', 'Others',],
    datasets: [{
        label: `Total no of Votes:${totalVotes}`,
        data: [voteCounts.Windows,voteCounts.MacOS,voteCounts.Linux,voteCounts.Other],
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)'
        ],
        borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)'
            
        ],
        borderWidth: 1
    }]
},
options: {
    scales: {
        yAxes: [{
            ticks: {
                stepSize: 1,
                beginAtZero: true,
                responsive: true,
                maintainAspectRatio: false
            }
        }]
    }
}

});


eventSource.addEventListener("message",(e)=>{
    const jsondata=JSON.parse(e.data);
    console.log(jsondata.os);
    console.log( myChart.data)
    if(jsondata.os==='Windows'){
        myChart.data.datasets[0].data[0]+=1;   
        myChart.update();  
    }if(jsondata.os==='MacOs'){
        myChart.data.datasets[0].data[1]+=1;
        myChart.update();
    }if(jsondata.os==='Linux'){
        myChart.data.datasets[0].data[2]+=1;
        myChart.update();
    }if(jsondata.os==='Other'){
        myChart.data.datasets[0].data[3]+=1;
        myChart.update();
    }
  
// chart.data.datasets[0].data[2] = 50
});
})
