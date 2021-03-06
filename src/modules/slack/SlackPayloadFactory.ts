import {SlackPayload,Field} from './SlackPayload'

/**
 * slackのincoming webhookにpostするpayloadを作成(次の日の通知用)
 * @param events regExpにマッチするdescriptionを持つeventの配列
 * @param regExp 通知が必要なパターン.　通知を送る内容を取得するために'()'を一つ含んでいる必要がある
 */
export const makeTomorrowRemindPayload = (events : GoogleAppsScript.Calendar.CalendarEvent[], regExp : RegExp) : SlackPayload => {
    const fields : Field[] = []
    for(let event of events){
        const eventField : Field = makeEventTitleField(event)
        const timeFiled : Field = makeTimeField(event)

        const matches : string[] = regExp.exec(event.getDescription())
        const detailField = {
            title : "Detail",
            value : matches[1],
            short : false
        }

        fields.push(eventField)
        fields.push(timeFiled)
        fields.push(detailField)
    }

    return {
        attachments : [
            {
                fallback : '明日の予定だよ〜〜〜',
                pretext : '<!channel> 明日の予定だよ〜〜〜',
                color : '#D00000',
                fields : fields
            }
        ]
    }
}

export const makeBeforeEventRemindPayload = (events : GoogleAppsScript.Calendar.CalendarEvent[]) : SlackPayload => {
    const fields : Field[] = []
    for(let event of events){
        const eventField : Field = makeEventTitleField(event)
        const timeFiled : Field = makeTimeField(event)

        fields.push(eventField)
        fields.push(timeFiled)
    }
    return {
        attachments : [
            {
                fallback : 'もうすぐゼミが始まるよ〜〜〜',
                pretext : '<!channel> もうすぐゼミが始まるよ〜〜〜',
                color : '#D00000',
                fields : fields
            }
        ]
    }
}

export const makeEventTitleField = (event : GoogleAppsScript.Calendar.CalendarEvent) : Field => {
    const eventField : Field = {
        title : "Event",
        value : event.getTitle(),
        short : false
    }
    return eventField
}

export const makeTimeField = (event : GoogleAppsScript.Calendar.CalendarEvent) : Field => {
    let timeStr : string
    if(event.isAllDayEvent()){
        timeStr = "All day"
    }else{
        const startTime : GoogleAppsScript.Base.Date = event.getStartTime()
        const endTime : GoogleAppsScript.Base.Date = event.getEndTime()
        timeStr = getTimeStr(startTime) + '-' + getTimeStr(endTime)
    }
    const timeFiled : Field = {
        title : "Time",
        value : timeStr,
        short : true
    }
    return timeFiled
}

const getTimeStr = (time : GoogleAppsScript.Base.Date) : string => {
    return ('0'+time.getHours()).slice(-2) + ':' + ('0'+time.getMinutes()).slice(-2)
}
