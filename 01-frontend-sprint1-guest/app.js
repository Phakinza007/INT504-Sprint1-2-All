let allSchedules = []

function renderSchedules(schedules){
    const tbody = document.getElementById('schedule-body')
    const emptyMessage = document.getElementById('empty-message')


   
    tbody.replaceChildren()
    //1. check Schedules empty

     if(schedules.length === 0) {
        emptyMessage.classList.remove('hidden')
        return
    }

    if(schedules.length > 0 ){
        emptyMessage.classList.add('hidden')
    }

   
    // 3.add data
    schedules.forEach((schedule) => {
        
        const tr = document.createElement("tr")
        tr.setAttribute("data-testid" , "schedule-row")
        tr.className = "border-t border-slate-200 hover:bg-slate-50"
        
        const codeTd = document.createElement("td")
        codeTd.textContent = schedule.course.code
        codeTd.setAttribute('data-testid' , 'code')
        codeTd.className = "px-4 py-6"

        const titleTd = document.createElement('td')
        titleTd.textContent = schedule.course.title
        titleTd.setAttribute('data-testid' , 'title')
        titleTd.className = "px-4 py-6"

        const typeTd = document.createElement("td")
        typeTd.textContent = schedule.course.type
        typeTd.setAttribute('data-testid' , 'type')
        typeTd.className = "px-4 py-6"

        const sectionTd = document.createElement("td")
        sectionTd.textContent = schedule.section
        sectionTd.setAttribute('data-testid' , 'section')
        sectionTd.className = "px-4 py-6"

        const groupTd = document.createElement("td")
        groupTd.textContent = schedule.studentGroup ?? ""
        groupTd.setAttribute('data-testid' , 'group')
        groupTd.className = "px-4 py-6"

        const dayTd = document.createElement("td")
        const rawDay = schedule.dayOfWeek || ""
        dayTd.textContent = rawDay.charAt(0).toUpperCase() + rawDay.slice(1).toLowerCase()
        dayTd.setAttribute('data-testid' , 'day')
        dayTd.className = "px-4 py-6"

        const timeTd = document.createElement("td")
        timeTd.textContent = `${schedule.startTime}-${schedule.endTime}`
        timeTd.setAttribute('data-testid' , 'time')
        timeTd.className = "px-4 py-6"

        const weekTd = document.createElement("td")
        weekTd.textContent = `${schedule.startWeek}-${schedule.endWeek}`
        weekTd.setAttribute('data-testid' , 'weeks')
        weekTd.className = "px-4 py-6"

        const remarksTd = document.createElement('td')
        remarksTd.textContent = schedule.remarks ?? ""
        remarksTd.setAttribute('data-testid' , 'remarks')
        remarksTd.className = "px-4 py-6"

        tr.appendChild(codeTd)
        tr.appendChild(titleTd)
        tr.appendChild(typeTd)
        tr.appendChild(sectionTd)
        tr.appendChild(groupTd)
        tr.appendChild(dayTd)
        tr.appendChild(timeTd)
        tr.appendChild(weekTd)
        tr.appendChild(remarksTd)


        tbody.appendChild(tr)
    
    });
   
}

const button = document.querySelectorAll('[data-year-level]')


button.forEach((btn) => {
  btn.addEventListener("click", () => {
    const url = new URL(window.location.href);
    const selectedYear = btn.dataset.yearLevel;

    if (selectedYear === "all") {
      url.searchParams.delete("yearLevel");
    } else {
      url.searchParams.set("yearLevel", selectedYear);
    }

    window.history.pushState(null, "", url);

   
    applyYearFilter(selectedYear);
  });
});


    


function applyYearFilter(selectedYear){
     let filteredSchedules
        if(selectedYear === 'all'){
            filteredSchedules = allSchedules
        }else {
            filteredSchedules = allSchedules.filter((schedule) => {
                return schedule.course.yearLevel === Number(selectedYear)
    })
}
    renderSchedules(filteredSchedules)

    button.forEach((yearbutton) => {
            if(selectedYear === yearbutton.dataset.yearLevel){
                yearbutton.setAttribute("aria-pressed" , "true")
                yearbutton.classList.add('bg-purple-600')
                yearbutton.classList.add('text-white')
                yearbutton.classList.remove('bg-white')
                yearbutton.classList.remove('text-black')
            }else{
                yearbutton.setAttribute("aria-pressed" , "false")
                yearbutton.classList.remove('bg-purple-600')
                yearbutton.classList.remove('text-white')
                yearbutton.classList.add('bg-white')
                yearbutton.classList.add('text-black')
            }
        })
    
}

window.addEventListener("popstate", () => {
    const params = new URLSearchParams(window.location.search)
    const initialYear = params.get("yearLevel") ?? "all"
    applyYearFilter(initialYear)
});

async function loadSchedules(){
    try{
        const response = await fetch('./api/v1/schedules')

        if(response.status !== 200){
            throw new Error("Failed to fetch schedules")
        }

        const data = await response.json()

        if(!Array.isArray(data)){
            throw new Error("Schedules must be an array")
        }

        allSchedules = data

        const params = new URLSearchParams(window.location.search)
        const selectedYear = params.get("yearLevel") ?? "all"

        applyYearFilter(selectedYear)
    }catch(error){
        console.log("Failed to load schedules", error)
        showErrorDialog()
    }
}

function showErrorDialog(){
    const dialog = document.getElementById('error-dialog')
    dialog.showModal()
}

const errorDialog = document.getElementById('error-dialog')

errorDialog.addEventListener('cancel', (event) => {
    event.preventDefault()
})

loadSchedules()
