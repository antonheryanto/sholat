<script lang="ts">
    import { timeRefs, hijri, times } from "$lib/jadualSholat";
    
    function getDayIndex() : number {
        let now = new Date();
        let start = new Date(now.getFullYear(), 0, 0);
        let diff = now.getTime() - start.getTime();
        let oneDay = 1000 * 60 * 60 * 24;
        let day = Math.floor(diff / oneDay);
        // console.log('Day of year: ' + day);
        return day - 1;
    }

    function getTime(hour: number, minute: number): String {
        let nowD = new Date();
        let nowH = new Date(nowD.getFullYear(), nowD.getMonth(), nowD.getDay(), hour);
        let now = new Date(nowH.getTime() + minute * 60000);
        //return `${now.getHours()}:${now.getMinutes()}`;
        return now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }
    
    let i = getDayIndex() * 9;
    let hijr = times.slice(i, i+3);
    let time = times.slice(i+3, i+3+6);
</script>

<h1>Jadual Solat</h1>
<h3> {Date()}</h3>
<h3> {hijr[0]} {hijri[hijr[1]]} {hijr[2]} Hijri</h3>
<table>
<thead>
    <tr>
        <th>Imsak</th>
        <th>Subuh</th>
        <th>Syuruk</th>
        <th>Zohor</th>
        <th>Asar</th>
        <th>Maghrib</th>
        <th>Isyak</th>
    </tr>
</thead>
<tbody>
    <tr>
        <td>{getTime(timeRefs[0], time[0]-10)}</td>
    {#each time as m, i}
        <td>{getTime(timeRefs[i], time[i])}</td>
    {/each}
    </tr>
</tbody>
</table>
