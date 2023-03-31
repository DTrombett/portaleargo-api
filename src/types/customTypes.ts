export type Token = {
	accessToken: string;
	expireDate: number;
	idToken: string;
	refreshToken: string;
	scopes: string[];
	tokenType: string;
};
export type Login = {
	schoolCode: string;
	options: Record<string, boolean>;
	isFirstAccess: boolean;
	disabledProfile: boolean;
	isResetPassword: boolean;
	isSpid: boolean;
	token: string;
	username: string;
};
export type Profile = {
	resetPassword: boolean;
	lastPwdChange: null;
	year: {
		startDate: number;
		year: string;
		endDate: number;
	};
	parent: {
		email: string;
		fullName: string;
		id: string;
	};
	disabledProfile: boolean;
	isSpid: boolean;
	student: {
		isLastYear: boolean;
		fullName: string;
		surname: string;
		name: string;
		id: string;
		adult: boolean;
		email: null;
	};
	card: {
		class: {
			id: string;
			grade: number;
			section: string;
		};
		course: {
			description: string;
			id: string;
		};
		site: {
			description: string;
			id: string;
		};
		school: {
			order: string;
			description: string;
			id: string;
		};
		id: string;
	};
	firstAccess: boolean;
	historicalProfile: boolean;
};
export type Dashboard = {
	updateDate: number;
	outOfClass: Record<
		string,
		{
			type: string;
			date: number;
			description: string;
			teacher: string;
			id: string;
			annotations: string;
			onLineFrequency: boolean;
		}
	>;
	msg: string;
	options: Record<string, boolean>;
	totalAverage: number;
	mensa: any;
	monthlyAverage: number[];
	subjectList: Record<
		string,
		{
			shortName: string;
			scrut: boolean;
			codTipo: string;
			doAverage: false;
			fullName: string;
			id: string;
		}
	>;
	deleteLocalData: boolean;
	periods: Record<
		string,
		{
			id: string;
			startDate: number;
			description: string;
			singleVote: boolean;
			finalAverage: number;
			hasFinalAverage: boolean;
			endDate: number;
			periodCode: string;
			isFinal: boolean;
		}
	>;
	reminders: Record<
		string,
		{
			type: string;
			date: number;
			details: string;
			idTeacher: string;
			visibleType: string;
			teacherName: string;
			startTime: string;
			id: string;
			endTime: string;
		}
	>;
	board: Record<
		string,
		{
			date: number;
			details: string;
			needAcknowledgement: boolean;
			category: string;
			acknowledgementDate: number;
			url: null;
			author: string;
			expirationDate: null;
			type: string;
			adRequest: boolean;
			acknowledged: boolean;
			confirmationDate: string;
			id: string;
			attachments: Record<
				string,
				{
					fileName: string;
					path: string;
					description: null;
					id: string;
					url: string;
				}
			>;
			expirationConfirmDate: null;
			confirmed: boolean;
		}
	>;
	sharedFile: { fileAlunniScollegati: []; listaFile: [] };
	grades: Record<
		string,
		{
			date: number;
			periodId: string;
			gradeString: string;
			grade: number;
			practical: boolean;
			teacher: string;
			subjectId: string;
			gradeType: null;
			prg: number;
			type: string;
			testDescription: string;
			faMenoMedia: string;
			pkTeacher: string;
			description: string;
			codType: string;
			averageCount: number;
			id: string;
			subject: string;
			subjectDetails: {
				subjectSchool: {
					code: string;
					schoolPrg: number;
					year: number;
					subjectPrg: number;
				};
				code: string;
				name: string;
				shortName: string;
				sectionCode: string;
				typeCode: string;
				hasAverage: boolean;
				aggregateCode: string;
				individualLessons: null;
				codInvalsi: null;
				ministerialCode: null;
				icon: string;
				description: null;
				hasInsufficiency: boolean;
				selected: boolean;
				prgSubject: number;
				type: string;
				types: string;
				hasIndividualLessons: boolean;
				subjectId: string;
			};
			comment: string;
		}
	>;
	newData: boolean;
	teacherList: Record<
		string,
		{
			surname: "DI LUCA";
			subjects: string[];
			name: string;
			id: string;
			email: string;
		}
	>;
	studentBoard: Record<
		string,
		{
			type: string;
			fileName: string;
			date: number;
			details: string;
			parentDownload: string;
			acknowledged: boolean;
			id: string;
		}
	>;
	disabledProfile: boolean;
	periodAverage: Record<
		string,
		{
			average: number;
			subjects: Record<
				string,
				{
					oralTestsTotal: number;
					oralTestsCount: number;
					average: number;
					writtenAverage: number;
					total: number;
					valueCount: number;
					testsCount: number;
					writtenTestsCount: number;
					writtenTestsTotal: number;
					oralAverage: number;
				}
			>;
			monthlyAverage: Record<`${number}`, number>;
		}
	>;
	subjectAverage: Record<
		string,
		{
			oralTestsTotal: number;
			oralTestsCount: number;
			average: number;
			writtenAverage: number;
			total: number;
			valueCount: number;
			testsCount: number;
			writtenTestsCount: number;
			writtenTestsTotal: number;
			oralAverage: number;
		}
	>;
	selfCertification: any;
	register: Record<
		string,
		{
			type: string;
			date: number;
			url: string;
			teacherId: string;
			homeworks: {
				details: string;
				dueDay: number;
			}[];
			teacher: string;
			subject: string;
			id: string;
			subjectId: string;
			activities: string;
			hour: number;
		}
	>;
	schede: any[];
	prenotazioniAlunni: any[];
	notes: any[];
	id: string;
	dailyEvents: Record<
		string,
		{
			type: string;
			date: number;
			description: string;
			toJustify: boolean;
			justified: boolean;
			eventCode: string;
			teacher: string;
			justificationComment: string;
			id: string;
			justificationDate: number;
			annotation: string;
		}
	>;
	extraClasses: boolean;
};
