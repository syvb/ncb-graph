function generateGraph(data) {
  var people = {};
  for (const voter in data.voters) {
    data.voters[voter].vote.forEach(vote => {
      if (!people[vote]) people[vote] = [];
      people[vote].push({
        voter: voter,
        amount: data.voters[voter].balance
      })
    });
  }
  let bars = document.createElement("div");
  bars.classList.add("graph");
  const sumPersonVotes = votes => votes.reduce((total, cur) => total + cur.amount, 0);
  let orderedPeople = Object.keys(people)
    .map(key => {
      let arr = people[key];
      arr.letter = key;
      return arr;
    })
    .sort((a, b) => sumPersonVotes(a) - sumPersonVotes(b))
    .reverse();
  
  const names = [{"id":"A","name":"LTD"},{"id":"B","name":"Wekkel"},{"id":"C","name":"Mat"},{"id":"D","name":"Sharms"},{"id":"E","name":"SirChef"},{"id":"F","name":"Chugwig"},{"id":"G","name":"Smitop"}];
  
  orderedPeople.forEach(person => {
    const votes = person.sort((a, b) => a.amount - b.amount).reverse().filter(user => user.amount > 0);
    const bar = document.createElement("div");
    const nameEle = document.createElement("span");
    nameEle.innerHTML = names.filter(name => person.letter === name.id)[0].name;
    
    nameEle.style.width = "15%";
    nameEle.style.paddingBottom="0.5em";
    //nameEle.style.backgroundColor = "#" + window.md5(nameEle.innerText).substr(0, 6);
    bar.appendChild(nameEle);
    bar.classList.add("bar");
    votes.forEach(vote => {
      let voteLine = document.createElement("span");
      voteLine.style.width = ((vote.amount / sumPersonVotes(orderedPeople[0])) * 85).toFixed(10) + "%";
      voteLine.style.backgroundColor = "#" + window.md5(vote.voter).substr(0, 6);
      voteLine.title = vote.amount.toFixed(2) + " NIM: " + vote.voter;
      voteLine.classList.add("vote-line")
      voteLine.setAttribute("x-addr",vote.voter)
      bar.appendChild(voteLine);
      //debugger;
    });
    bars.appendChild(bar);
  });
  console.log(people);
  return bars;
}

async function main() {
  var data = await (await fetch("https://vote.smitop.com:8080/getVotes")).json();
  var graphHtml = generateGraph(data);
  document.getElementById("graph").outerHTML = graphHtml.outerHTML;
  document.querySelectorAll(".vote-line").forEach(voteLine => {
    voteLine.onclick = function () {
      window.open("https://nimiq.watch/#" + this.getAttribute("x-addr"));
    }
  });
}
main();
