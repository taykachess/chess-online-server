<script lang="ts">
  import PlayerComponent from "$components/common/PlayerComponent.svelte";
  import type { prisma } from "$sockets/global/prisma";
  import type { Prisma } from "@prisma/client";
  import {
    AccordionItem,
    Accordion,
    Badge,
    Timeline,
    TimelineItem,
    Button,
  } from "flowbite-svelte";
  const items = Array(3);

  type Game = Prisma.GameGetPayload<{}, typeof prisma["$extends"]["extArgs"]>;

  interface Stage {
    control: string;
    time: number;
    tsmp: number;
    games: Pick<Game, "result" | "white" | "black" | "id">[];
  }

  const stages: Stage[] = [
    {
      control: "3+0",
      time: 10,
      tsmp: Date.now(),
      games: [
        {
          result: "1-0",
          white: { username: "tayka", rating: 2434, title: "GM" },
          black: { username: "tayka", rating: 2434, title: "GM" },
          id: "23",
        },
      ],
    },
  ];

  // const open_all = () => items.forEach((_,i)=> items[i] = true)
  // const close_all= () => items.forEach((_,i)=> items[i] = false)
</script>

<div class=" bg-white">
  <!-- prettier-ignore -->
  <Accordion multiple>
    {#each stages as stage, index }
    <AccordionItem bind:open={items[0]}>
      <div slot="header" class=" flex justify-between items-center w-full">
        <div class=" flex items-center  justify-center">
          <div class=" mr-2"> {index + 1} этап</div>
          <div class=" bg-slate-900 text-white text-xs p-px px-1 rounded ">{stage.control}</div>
          <div class=" text-slate-700 text-sm ml-2 ">(5:32/10:00)</div>
        </div>

          <div class=" flex items-baseline">
            <div class=" bg-green-900 text-white text-xs p-px px-1 rounded ">3.5</div>
            <div class=" mx-1">:</div>
            <div class=" bg-red-900 text-white text-xs p-px px-1 rounded ">2.5</div>
          </div>
      </div>
      
      <div slot="arrowup" class=""></div>
      <div slot="arrowdown" class=""></div>
      <Timeline customClass="" >
        {#each stage.games as game }
        <div class=" cursor-pointer hover:bg-slate-100">
          <TimelineItem   date="1 партия" >
            <div class=" flex items-baseline text-base font-normal text-gray-500 dark:text-gray-400">
      
              <PlayerComponent title={game.white.title} username={game.black.username} rating={game.white.rating}/> 
              <!-- <div class=" ml-1 bg-green-900 text-white text-xs p-px px-1 rounded ">1</div> -->
              <div class=" mx-1">-</div>
              <!-- <div class=" mr-1 bg-red-900 text-white text-xs p-px px-1 rounded ">0</div> -->
               <PlayerComponent title={game.black.title} username={game.black.username} rating={game.black.rating}/>
      
            </div>
            <div class="">
              <span class="  text-sm  italic">{game.result}, черные сдались</span>
              
            </div>
           
            
          </TimelineItem>
          
        </div>
          
        {/each}
        <div class="">
          <TimelineItem  date="2 партия">
            <div class=" flex text-base font-normal text-gray-500 dark:text-gray-400">
      
              <PlayerComponent/> 
              <div class=" mx-1">-</div>
               <PlayerComponent/>
            </div>
            
          </TimelineItem>

        </div>
  
</Timeline>
    </AccordionItem>
      
    {/each}
      <!-- <AccordionItem bind:open={items[1]}>
        <div slot="header">My Header 2</div>
        <p class="mb-2 text-gray-500 dark:text-gray-400">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illo ab necessitatibus sint explicabo ...</p>
        <p class="mb-2 text-gray-500 dark:text-gray-400">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illo ab necessitatibus sint explicabo ...</p>
        <p class="mb-2 text-gray-500 dark:text-gray-400">Learn more about these technologies:</p>
      </AccordionItem>
      <AccordionItem bind:open={items[2]}>
        <div slot="header">My Header 3</div>
        <p>Something more</p>
      </AccordionItem> -->
    </Accordion>
</div>
