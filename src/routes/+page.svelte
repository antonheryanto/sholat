<script lang="ts">
    import { times } from "$lib/jadualSholat";
    function getDayIndex() : number {
        let now = new Date();
        let start = new Date(now.getFullYear(), 0, 0);        
        let diff = now.getTime() - start.getTime();
        let oneDay = 1000 * 60 * 60 * 24;
        let day = Math.floor(diff / oneDay);
        // console.log('Day of year: ' + day);
        return day - 1;
    }
    let i = getDayIndex();
    let time = times[i];
</script>

<h1>Jadual Solat</h1>
<h2> {Date()}</h2>
<table>
<thead>
    <tr>
        <th>Tarikh</th>
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
    {#each time as m}
        <td>{m}</td>
    {/each}
    </tr>
</tbody>
</table>
