type LotteryItem = {
	index: number;
	name: string;
};

type LotteryState = {
	isRun: boolean;
	isRunDisable: boolean;
	isFinish: boolean;

	// member
	memberList: LotteryItem[];
	activeMemberList: LotteryItem[];
	textMemberList: string;
	textActiveMemberList: string;

	// prize
	prizeList: LotteryItem[];
	activePrizeList: LotteryItem[];

	textPrizeList: string;
	textActivePrizeList: string;

	// result
	textResult: string;
	// allResultList: string[];
	textAllResultList: string;
};

type LotteryAction =
	| { type: "UPDATE_MEMBER_LIST"; text: string }
	| { type: "UPDATE_PRIZE_LIST"; text: string }
	| { type: "RUN" }
	| { type: "RESET" };

export const initialState = {
	isRun: false,
	isRunDisable: true,
	isFinish: false,
	memberList: [],
	activeMemberList: [],
	textMemberList: "",
	textActiveMemberList: "",
	prizeList: [],
	activePrizeList: [],
	textPrizeList: "",
	textActivePrizeList: "",
	textResult: "",
	textAllResultList: "",
};

export const inputToLotteryItemList = (text: string): LotteryItem[] => {
	return text
		.split("\n")
		.map((item, index) => {
			return {
				index,
				name: item.trim(),
			};
		})
		.filter((item) => item.name !== "");
};

export const lotteryItemListToText = (list: LotteryItem[]): string => {
	return list.map((item) => item.name).join("\n");
};

export const checkIsRunDisable = (
	memberList: LotteryItem[],
	prizeList: LotteryItem[],
): boolean => {
	return !(memberList.length > 0 && prizeList.length > 0);
};

export const checkIsFinish = (
	memberList: LotteryItem[],
	prizeList: LotteryItem[],
) => {
	return memberList.length === 0 || prizeList.length === 0;
};

export const getRandomIndex = (length: number): number => {
	return Math.floor(Math.random() * length);
};

export const getActiveList = (prevActiveList: LotteryItem[]) => {
	const randomMemberIndex = getRandomIndex(prevActiveList.length);
	const pickItem = prevActiveList[randomMemberIndex];
	const activeList = prevActiveList.filter((item) => item !== pickItem);
	const textActiveList = lotteryItemListToText(activeList);

	return {
		pickItem,
		activeList,
		textActiveList,
	};
};

export const lotteryReducer = (
	state: LotteryState,
	action: LotteryAction,
): LotteryState => {
	switch (action.type) {
		case "UPDATE_MEMBER_LIST": {
			const { text: textMemberList, text: textActiveMemberList } = action;

			const memberList = inputToLotteryItemList(textMemberList);
			const isRunDisable = checkIsRunDisable(memberList, state.prizeList);

			return {
				...state,
				isRunDisable,
				memberList,
				textMemberList,
				activeMemberList: memberList,
				textActiveMemberList,
			};
		}
		case "UPDATE_PRIZE_LIST": {
			const { text: textPrizeList, text: textActivePrizeList } = action;

			const prizeList = inputToLotteryItemList(textPrizeList);
			const isRunDisable = checkIsRunDisable(state.memberList, prizeList);

			return {
				...state,
				isRunDisable,
				prizeList,
				textPrizeList,
				activePrizeList: prizeList,
				textActivePrizeList,
			};
		}
		case "RUN": {
			const isRun = true;

			const {
				pickItem: member,
				activeList: activeMemberList,
				textActiveList: textActiveMemberList,
			} = getActiveList(state.activeMemberList);
			const {
				pickItem: prize,
				activeList: activePrizeList,
				textActiveList: textActivePrizeList,
			} = getActiveList(state.activePrizeList);

			// resolve results
			const textResult = `${member.name} - ${prize.name}`;
			const textAllResultList = state.textAllResultList
				? `${state.textAllResultList}\n${textResult}`
				: textResult;

			const isFinish = checkIsFinish(activeMemberList, activePrizeList);

			const isRunDisable = !(
				state.memberList.length !== 0 &&
				state.prizeList.length !== 0 &&
				!isFinish
			);

			return {
				...state,
				activeMemberList,
				textActiveMemberList,
				activePrizeList,
				textActivePrizeList,
				textResult,
				textAllResultList,
				isFinish,
				isRun,
				isRunDisable,
			};
		}
		case "RESET": {
			const activeMemberList = state.memberList;
			const textActiveMemberList = state.textMemberList;
			const activePrizeList = state.prizeList;
			const textActivePrizeList = state.textPrizeList;

			const isRunDisable = checkIsRunDisable(state.memberList, state.prizeList);

			return {
				...state,
				isRun: false,
				isRunDisable,
				isFinish: false,

				activeMemberList,
				textActiveMemberList,

				activePrizeList,
				textActivePrizeList,

				textResult: "",
				textAllResultList: "",
			};
		}
		default: {
			throw new Error("Invalid action type");
		}
	}
};
