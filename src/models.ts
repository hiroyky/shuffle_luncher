export interface AskEvent {
    /** 開催年 */
    heldYear?: number;


    /** 開催月(js式 1月が0, 12月が11) */
    heldMonth?: number;

    /** 開催曜日(js式 日曜が0, 土曜が6) */
    heldDay: number;

    /** アンケートの回答期限 */
    answerExpires: string;
}