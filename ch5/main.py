#  "佛經文學=sutra literature; 宣佛小說=the novel that publicize Buddhism; 比較文學=comparative literature"
#  ["佛經文學", "sutra literature", "宣佛小說", "the novel that publicize Buddhism", "比較文學", "comparative literature"]

def strToArr(str):
    output = []
    
    arr = str.split(';')
    for s in arr:
        if "=" in s:
            arr2 = s.split('=')
            output += arr2
        else:
            output.append(s)
        # print(arr2)
    
    output = [s.strip() for s in output]
    print(output)
    
strToArr("魏晉南北朝; 志怪小說; 宣佛; 思想傾向")
