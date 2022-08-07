
export const clamp = (min,max,value)=>value<min?min:value>max?max:value


/*** sortedCommon:
 * 
 * example:
input 
    arr1 = [1,2,3,4,5,6,7,8]
    arr2 = [2,3,15,6]

output 
    [2,3,6]
***/
export const sortedCommon = (arr1=[],arr2=[],compareFunction=(a,b)=>a===b)=>{
    const Arr1 = (arr1?.length>arr2?.length?arr1:arr2) || []
    const Arr2 = (arr1?.length>arr2?.length?arr2:arr1) || []
    return Arr1.reduce((acc,cur)=>( 
            acc.same = compareFunction(cur,Arr2[acc.i]),
            acc.i+= acc.same?1:0,
            acc.same?acc.result.push(cur):'',
            acc
          ),
         {same:false,i:0,result:[]}).result
}

export const matchFuzzy = (str='',search='')=>{
    const strArr = str?.toLowerCase?.()?.split?.('') || []
    const searchArr = search?.toLowerCase?.()?.split?.('') || []
    return sortedCommon(strArr,searchArr).length>=searchArr.length
}


